# stdlib
import os
import datetime
import time
from pathlib import Path
import json

# installed
from bottle import route, run, static_file
import toml
import pytz
import git
import munch

# local
import metoffice
import gcalendar
import astro
from img_file_cache import cached_file
import tides
import numpy as np

## Configuration and constants
# read the config
with open("config.toml") as f:
    config = munch.Munch.fromDict(toml.load(f))

# root for static files (e.g. index.html, CSS, JS, etc.)
static_root = '../frontend'

with open("../secrets/keys.json") as f:
    secrets = json.load(f)

config.location.lon, config.location.lat = secrets["lon"], secrets["lat"]
config.metoffice.stations = munch.Munch.fromDict(metoffice.find_nearest_stations(lon=config.location.lon, lat=config.location.lat))

# return the synoptic map when requested (by dynamic lookup of the URL) and apply inversion
config.images["synoptic_map.gif"] = {"url":metoffice.get_current_synoptic_url, "width":400, "height":400, "expiry_hours":3, 
"resize":True, "invert":True, "crop":[220,135,640,535]}

config.images["composite_map.png"] = {"fn":metoffice.get_satellite_composite, "width":600, "height":600, "expiry_hours":3}

## Routes
@route('/cached_img/<filename>')
def cached_image(filename):    
    if filename in config.images:        
        # download file as needed
        config.images[filename]["fname"] = filename
        local_file = cached_file(config.images[filename], 
            expiry_hours=config.images[filename].get("expiry_hours",4))        
        root, fname = os.path.split(local_file)              
        return static_file(fname, root=root)

## Routes
@route('/image/<filename>')
def images(filename):    
    if filename in config.images:
        response = dict(config.images[filename])
        response["fn"] = "" # remove any unserializable callbacks
        response["url"] = "/cached_img/"+filename
        return response
    return {}

# return whether network is working, and what the SSID is
@route('/wifi')
def wifi():
    response = {"ssid":"Test WIFI", "connected":False}
    return response

# frontend must call this regularly to prevent
# the keepalive script from shutting down and restarting
@route('/keepalive') 
def keepalive():   
    Path('alive.txt').touch()
    return {"status":"ok"}

# report current location, in sexagesimal, as a dictionary mapping lat,lon
# to triples of integers
@route('/location')
def get_location():
    def intarray(s):
        return [int(elt) for elt in s.split(":")]
    return {"lat":intarray(config.location.lat), 
            "lon":intarray(config.location.lon)}

# The display format for the time/date/etc.
@route('/date')
def date():    
    dt = datetime.datetime.now()
    dayname = "{dt:%A} {dt.day} {dt:%B}".format(dt=dt)
    return {"date":dayname, "isotime":dt.isoformat()}

@route('/version')
def version():    
    repo = git.Repo(search_parent_directories=True)
    sha = repo.head.object.hexsha.upper()
    sha = sha[0:4] + " " + sha[4:8]
    date = repo.head.object.committed_datetime.isoformat()[:10]
    return {"sha":sha, "date":date}

# The display format for the time/date/etc.
@route('/time')
def curtime():    
    dt = datetime.datetime.now()    
    current_time = "{dt:%H}:{dt:%M}".format(dt=dt)
    tz = time.strftime('%Z%z')
    return {"time":current_time, "timezone":tz, "isotime":dt.isoformat()}    

## forecasts 
@route('/metoffice/forecast')
def full_forecast():
    # return the metoffice forecast for the current station
    # in its native foremat
    return metoffice.forecast(config.metoffice.stations.forecast)


@route('/metoffice/observation')
def observations():
    # return the metoffice forecast for the current station
    # in its native foremat
    return metoffice.observation(config.metoffice.stations.observation)

@route('/metoffice/text_forecast')
def text_forecast():
    # return the metoffice text regional forecast for the current region    
    return metoffice.txtquery(config.metoffice.stations.region)

@route('/metoffice/inshore_forecast')
def inshore_forecast():    
    #return {}
    return metoffice.inshore_forecast(config.metoffice.inshore_area)

@route('/metoffice/shipping_forecast')
def shipping_forecast():    
    forecast = metoffice.shipping_forecast()
    return {"synopsis":forecast["synopsis"],
     "local_area":forecast["areas"][config.metoffice.shipping_area]}

# images

## forecasts 
@route('/metoffice/satellite_images')
def satellite_images():
    # return the metoffice forecast for the current station
    # in its native foremat
    return metoffice.observed_images()

@route('/metoffice/synoptic_map')
def synoptic_map():
    # return the metoffice forecast for the current station
    # in its native foremat    
    return {"map":metoffice.surface_pressure()}
    
## astronomical computations (sun/moon location)

# Astronomical calculations
astro_observer = astro.Astro(lat=config.location.lat, 
                            lon=config.location.lon, elev=0)

@route('/astro/solar_day')
def solarday():
    return astro_observer.solar_day()

@route('/astro/lunar_phase')
def lunar_phase():
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

# tidal predictions
@route('/tides')
def tide(day=0):    
    today = np.datetime64(datetime.datetime.now().date()) + np.timedelta64(int(day), 'D')
    # predict every minute for 5 days
    hours = np.arange(0,5*24*60) * np.timedelta64(1, 'm') + today
    # load constants fron file
    with open(config.tides.constituents_file) as f:
        constituents = json.load(f)
    heights = tides.tide_predict(hours, constituents, config.tides.get("local_time_offset", "00:00:00"))
    return {"times":[h.item().isoformat() for h in hours], "heights":list(heights)}

## send static files
@route('/<filename:path>')
def send_static(filename):
    return static_file(filename, static_root)    

# Google calendar; return next n events
@route('/events')
def calendar_events(n=20):
    return gcalendar.get_events(n)
    

## start the server
run(host='localhost', port=config.server.port,  debug=True, 
    reloader=True, server='tornado')

    