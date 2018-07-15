from bottle import route, run
from bottle import static_file
import os
import datetime
import requests
import time
from bs4 import BeautifulSoup
import pyephem



static_root = '../frontend'

@route('/<filename:path>')
def send_index(filename):
    return static_file(filename, static_root)

@route('/location')
def location():
    return {"lat":[60, 11, 37], 'lon':[-1,17,40]}

# The display format for the time/date/etc.
@route('/date')
def date():    
    dt = datetime.datetime.now()
    dayname = "{dt:%A} {dt.day} {dt:%B}".format(dt=dt)
    current_time = "{dt:%H}:{dt:%M}".format(dt=dt)
    tz = time.strftime('%Z%z')
    return {"date":dayname, "time":current_time, "timezone":tz}

def dictify_dl(dl_tag):
    d = {}
    key = dl_tag.findNext('dt')
    value = dl_tag.findNext('dd')    
    while key is not None and value is not None:
        d[key.contents[0]] = value.contents[0]
        key = value.findNext('dt')
        value = value.findNext('dd')            
    return d
        

@route('/localforecast')
def localforecast():
    forecast_url = "https://www.metoffice.gov.uk/public/weather/marine/inshore-waters-forecast"
    area = 'iw18' # Shetland Islands
    
    forecast = requests.get(forecast_url).content
    soup = BeautifulSoup(forecast)
    div = soup.find('div', attrs={"class":"marineCard card forecast", "data-value":area})
    # <h3> general situation </h3> <p> situation </p>
    general_situation = div.findNext("h3").findNext('p').contents[0]
    # structure
    # dl (today)
    # dt (title) dd (data)
    # dl (tomorrow)
    # dt (title) dd (data)    
    # keys: Wind, Sea state, Weather, Visibility
    today_forecast = div.findNext('dl')
    tomorrow_forecast = div.findNext('dl')    
    return {"general":general_situation, "today":dictify_dl(today_forecast), "tomorrow":dictify_dl(tomorrow_forecast)}




run(host='localhost', port=8080, debug=True, reloader=True)

    