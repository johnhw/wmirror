import requests
from bs4 import BeautifulSoup
import json
import ephem
from lxml import etree


"""

U int The strength of the sun's ultraviolet (UV) radiation is expressed as a 'Solar UV Index', a system
developed by the World Health Organization. These Met Office forecasts include the effects of:
the position of the sun in the sky;
forecast cloud cover;
ozone amounts in the stratosphere.
The solar index does not exceed 8 in the UK (8 is rare; 7 may occur on exceptional days, mostly in
the two weeks around the summer solstice). Indices of 9 and 10 are common in the Mediterranean
area.
The UV Index can take the following values:
1-2 Low exposure. No protection required. You can safely stay outside
3-5 Moderate exposure. Seek shade during midday hours, cover up and wear sunscreen
6-7 High exposure. Seek shade during midday hours, cover up and wear sunscreen
8-10 Very high. Avoid being outside during midday hours. Shirt, sunscreen and hat are
essential
11 or
over
Extreme. Avoid being outside during midday hours. Shirt, sunscreen and hat
essential.
W int Significant weather as a code:
NA Not available
0 Clear night
1 Sunny day
2 Partly cloudy (night)
3 Partly cloudy (day)
4 Not used
5 Mist
6 Fog
7 Cloudy
8 Overcast
9 Light rain shower (night)
10 Light rain shower (day)
11 Drizzle
12 Light rain
13 Heavy rain shower (night)
14 Heavy rain shower (day)
15 Heavy rain
16 Sleet shower (night)
17 Sleet shower (day)
18 Sleet
19 Hail shower (night)
20 Hail shower (day)
21 Hail
22 Light snow shower (night)
23 Light snow shower (day)
24 Light snow
25 Heavy snow shower (night)
26 Heavy snow shower (day)
27 Heavy snow
28 Thunder shower (night)
29 Thunder shower (day)
30 Thunder
V int or
string
Visibility in metres or as a code:
UN Unknown
VP Very poor - Less than 1 km
PO Poor - Between 1-4 km
MO Moderate - Between 4-10 km
GO Good - Between 10-20 km
VG Very good - Between 20-40 km
EX Excellent - More than 40 km
T float
or int Screen temperature in degrees Celsius (°C)
S float
or int Wind speed in miles per hour (mph)
P float
or int Mean sea level pressure in hectopascals (hPa)
Pp float
or int This gives the Precipitation Probability as a percentage (%)
H float
or int Screen relative humidity in percent (%)
G float
or int Wind gust in miles per hour (mph)
F float
or int Feels like temperature in degrees Celsius (°C)
D string Wind direction 16-point compass direction e.g. S, SSW, SW, etc.
$ int or
string
The number of minutes after midnight UTC on the day represented by the Period object in which
the Rep object is found. For the daily forecasts this will instead be 'Day' or 'Night'.

Region codes for forecasts
os Orkney and Shetland
he Highland and Eilean Siar
gr Grampian
ta Tayside
st Strathclyde
dg Dumfries, Galloway, Lothian
ni Northern Ireland
yh Yorkshire and the Humber
ne Northeast England
em East Midlands
ee East of England
se London and Southeast England
nw Northwest England
wm West Midlands
sw Southwest England
wl Wales
uk United Kingdom
"""

"""XML feed for shipping forecast: """



with open("../secrets/keys.json") as f:
    keys = json.load(f)
    api_key = keys['met_office_data_point']

def recursive_dict(element):
    return element.tag, dict(map(recursive_dict, element)) or element.text

def shipping_forecast():
    shipping_forecast_url = "https://www.metoffice.gov.uk/public/data/CoreProductCache/ShippingForecast/Latest"
    forecast_xml = requests.get(shipping_forecast_url).content
    root = etree.fromstring(forecast_xml)
    # get general synopsis
    synopsis = root.xpath("/report/general-synopsis/gs-text")[0].text
    forecasts = root.xpath("/report/area-forecasts")
    areas = {}
    # iterate over each area
    for area_forecast in forecasts[0]:
        areas = area_forecast.findall("area")
        for area in areas:
            # index by area name
            dict_forecast = recursive_dict(area)
            areas[dict_forecast['main']] = dict_forecast

    return {"synopsis":synopsis, "areas":areas}


def dictify_dl(dl_tag):
    # Find tags in the form <dt> title </dt> <dd> data </dd>
    # and put them into a dictionary
    d = {}    
    keys = dl_tag.findAll('dt')
    values = dl_tag.findAll('dd')        
    for k,v in zip(keys,values):        
        d[k.contents[0]] = v.contents[0]        
    return d
        

def inshore_forecast(area):
    forecast_url = "https://www.metoffice.gov.uk/public/weather/marine/inshore-waters-forecast"        
    forecast = requests.get(forecast_url).content
    soup = BeautifulSoup(forecast)
    div = soup.find('div', attrs={"class":"marineCard card forecast", "data-value":area})
    # <h3> general situation </h3> <p> situation </p>
    general_situation = div.findNext("h3").findNext('p')
    # structure
    # dl (today)
    # dt (title) dd (data)
    # dl (tomorrow)
    # dt (title) dd (data)    
    # keys: Wind, Sea state, Weather, Visibility    
    today_forecast = general_situation.parent.parent.find('dl')    
    tomorrow_forecast = today_forecast.findNext('dl')    
    return {"general":general_situation.contents[0], "today":dictify_dl(today_forecast), "tomorrow":dictify_dl(tomorrow_forecast)}

def sites():
    return query("sitelist")


def nearest_station(lon, lat):
    # find the nearest weather station to the given observer
    observer = ephem.Observer()
    observer.lon = lon
    observer.lat = lat
    sitelist = sites()
    angles = []
    for site in sitelist["Locations"]["Location"]:    
        # construct a new observer
        site_obs = ephem.Observer()    
        site_obs.lon = site["longitude"]
        site_obs.lat = site["latitude"]
        # compute angular distance
        angle = float(ephem.separation(observer, site_obs))        
        angles.append((angle, site))
    # return the dictionary describing this site
    return sorted(angles, key=lambda x:x[0])[0][1]

def capabilities():
    return query("capabilities")

def forecast(site_id):
    return query(site_id, params={"res":"3hourly"})

def observation(site_id):
    return query(site_id, mode='wxobs', params={"res":"hourly"})    

def _query(url, params={}):
    params = dict(params)
    params.update({"key":api_key})
    result = requests.get(url, params=params)    
    if result.content:
        return json.loads(result.content)
    return None

metoffice_base_url ="http://datapoint.metoffice.gov.uk/public/data/" 

def query(endpoint, mode='wxfcs', params={}):    
    url = metoffice_base_url + "val/{mode}/all/json/{endpoint}".format(endpoint=endpoint, mode=mode)
    return _query(url, params)
    
def txtquery(endpoint, wxtype='regionalforecast', params={}):    
    url = metoffice_base_url+"txt/wxfcs/{wxtype}/json/{endpoint}".format(endpoint=endpoint, wxtype=wxtype) 
    return _query(url, params)
    
def surface():
    url = metoffice_base_url+"image/wxfcs/surfacepressure/json/capabilities"
    return _query(url)
    
def obsimage():
    url = metoffice_base_url+"layer/wxobs/all/json/capabilities"
    return _query(url)

def get_image_uri(uri):
    # substitute api key
    uri = uri.replace("{key}", api_key)
    return uri

#print(forecast("353917"))
#print(observation("353917"))
#print(txtquery('sitelist'))
#print(txtquery('500'))
#print(capabilities())
#print(surface())
#print(localforecast('iw18'))
#print(shipping_forecast("Fair Isle"))