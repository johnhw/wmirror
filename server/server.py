from bottle import route, run
from bottle import static_file
import os
import datetime

import time

import metoffice
import astro
from file_cache import cached_file
from pathlib import Path


# Geographical location
# location in sexigesimal degrees
location = {"lat":[60, 11, 37], 'lon':[-1,17,40]}

# for MetOffice forecast
inshore_area = 'iw18' # Shetland Islands

# key:value pairs, indicating a "local name" for a file, and the corresponding URL it should be fetched from
# this will be cached automatically
cached_images = {
    "solar_image.jpg":"https://sdo.gsfc.nasa.gov/assets/img/latest/f_211_193_171pfss_1024.jpg",
    "aurora_prediction.jpg":"http://services.swpc.noaa.gov/images/animations/ovation-north/latest.jpg"}

# root for static files (e.g. index.html, CSS, JS, etc.)
static_root = '../frontend'

@route('/cached_img/<filename>')
def cached_image(filename, expiry_hours=4):
    if filename in cached_images:        
        # download file as needed
        local_file = cached_file(cached_images[filename], expiry_hours=expiry_hours)        
        root, fname = os.path.split(local_file)              
        return static_file(fname, root=root)

# Astronomical calculations
astro_observer = astro.Astro(lat=":".join([str(l) for l in location['lat']]), lon=":".join([str(l) for l in location['lon']]), elev=0)

#metoffice_station = metoffice.nearest_station(lon=astro_observer.lon, lat=astro_observer.lat)
metoffice_region = "os" # hardcoded for Orkney and Shetland region

# frontend must call this regularly to prevent
# the keepalive script from shutting down and restarting
@route('/keepalive') 
def keepalive():   
    Path('alive.txt').touch()
    return {"status":"ok"}

# send static files
@route('/<filename:path>')
def send_static(filename):
    return static_file(filename, static_root)

# report current location, in sexagesimal, as a dictionary mapping lat,lon
# to triples of integers
@route('/location')
def get_location():
    return location

# The display format for the time/date/etc.
@route('/date')
def date():    
    dt = datetime.datetime.now()
    dayname = "{dt:%A} {dt.day} {dt:%B}".format(dt=dt)
    return {"date":dayname}

# The display format for the time/date/etc.
@route('/time')
def date():    
    dt = datetime.datetime.now()    
    current_time = "{dt:%H}:{dt:%M}".format(dt=dt)
    tz = time.strftime('%Z%z')
    return {"time":current_time, "timezone":tz}    

@route('/metoffice/localforecast')
def localforecast():
    return metoffice.inshore_forecast(inshore_area)

@route('/astro/solar_day')
def solarday():
    return astro_observer.solar_day()

@route('/astro/lunar_phase')
def solarday():
    return astro_observer.lunar_phase()

@route('/astro/locations')
def locations():
    return astro_observer.locations()    

@route('/astro/transits')
def transits():
    return astro_observer.transits()      

@route('/astro/analemma')
def analemma():
    return astro_observer.solar_analemma()          

run(host='localhost', port=8080, debug=True, reloader=True)

    