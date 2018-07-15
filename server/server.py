from bottle import route, run
from bottle import static_file
import os
import datetime

import time

import metoffice
import astro
from file_cache import cached_file



location = {"lat":[60, 11, 37], 'lon':[-1,17,40]}


cached_images = {"solar_image.jpg":"https://sdo.gsfc.nasa.gov/assets/img/latest/f_211_193_171pfss_1024.jpg"}

@route('/cached_img/<filename>')
def cached_image(filename, expiry_hours=4):
    if filename in cached_images:        
        # download file as needed
        local_file = cached_file(cached_images[filename], expiry_hours=expiry_hours)        
        root, fname = os.path.split(local_file)              
        return static_file(fname, root=root)



static_root = '../frontend'

# location in sexigesimal degrees

observer = astro.Astro(lat=":".join([str(l) for l in location['lat']]), lon=":".join([str(l) for l in location['lon']]), elev=0)

@route('/<filename:path>')
def send_index(filename):
    return static_file(filename, static_root)

@route('/location')
def location():
    return location

# The display format for the time/date/etc.
@route('/date')
def date():    
    dt = datetime.datetime.now()
    dayname = "{dt:%A} {dt.day} {dt:%B}".format(dt=dt)
    current_time = "{dt:%H}:{dt:%M}".format(dt=dt)
    tz = time.strftime('%Z%z')
    return {"date":dayname, "time":current_time, "timezone":tz}

@route('/metoffice/localforecast')
def localforecast():
    return metoffice.localforecast()

@route('/astro/solar_day')
def solarday():
    return observer.solar_day()

@route('/astro/lunar_phase')
def solarday():
    return observer.lunar_phase()

@route('/astro/locations')
def solarday():
    return observer.locations()    

@route('/astro/transits')
def solarday():
    return observer.transits()      

run(host='localhost', port=8080, debug=True, reloader=True)

    