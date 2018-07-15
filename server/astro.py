import ephem
import math
import datetime
from datetime import timedelta

def local_transit(transit, body, location, date, horizon='0', use_center=False):
    # deal with sun never coming up/going down
    if date=='always':
        return 'always'
    if date=='never':
        return 'never'
    
    location.date = date
    location.horizon = horizon
    transit_fn = {"noon":location.next_transit, "rising":location.previous_rising, "setting":location.next_setting}[transit]    
    try:
        if use_center:
            time = ephem.localtime(transit_fn(body, use_center=use_center))
        else:
            time = ephem.localtime(transit_fn(body))
        return time
    except ephem.AlwaysUpError:
        return 'always'
    except ephem.NeverUpError:
        return 'never'
    

def format_date(d):
    if type(d)==type(""):
        return d
    else:
        return d.isoformat()

class Astro:
    def __init__(self, lon, lat, elev=0):
        self.here = ephem.Observer()
        self.here.lon = lon
        self.here.lat = lat
        self.sun = ephem.Sun()
        self.moon = ephem.Moon()
        
    def locations(self, date=None):
        if date is None:
            date = datetime.datetime.utcnow() 
        self.moon.compute(self.here)
        self.sun.compute(self.here)
        return {"moon": {"time":ephem.localtime(ephem.date(date)).isoformat(), "alt":self.moon.alt, "az":self.moon.az},
        "sun": {"time":ephem.localtime(ephem.date(date)).isoformat(), "alt":self.sun.alt, "az":self.sun.az}}
        
    def transits(self, date=None, n=240):
        if date is None:
            date = datetime.datetime.utcnow() 
        
        
        morning = ephem.date(date.date())
        evening = ephem.date(date.date()+timedelta(hours=24))
        lunar_transit = []
        solar_transit = []
        for i in range(n):
            time = (morning) + (evening-morning)*(i/(n-1))
            self.here.date = time
            self.moon.compute(self.here)
            self.sun.compute(self.here)

            lunar_transit.append({"time":ephem.localtime(ephem.date(time)).isoformat(), "alt":self.moon.alt, "az":self.moon.az})
            solar_transit.append({"time":ephem.localtime(ephem.date(time)).isoformat(), "alt":self.sun.alt, "az":self.sun.az})
            
        return {"moon":lunar_transit, "sun":solar_transit}

    def lunar_phase(self, date=None):
        # phase is a fraction 0.0 -> 1.0
        # radius is visual radius in arcseconds
        # direction is Waxing or Waning
        # name is Gibbous or Crescent
        lunar_names = [['Waxing', 'Crescent'], ['Waxing', 'Gibbous'],
         ['Waning', 'Gibbous'], ['Waning', 'Crescent']]

        if date is None:
            date = datetime.datetime.utcnow() 
        self.moon.compute(date)
        self.sun.compute(date)

        # lunar name computation from
        # https://stackoverflow.com/questions/26702144/human-readable-names-for-phases-of-the-moon-with-pyephem
        sunlon = ephem.Ecliptic(self.sun).lon
        moonlon = ephem.Ecliptic(self.moon).lon
        tau = 2.0 * ephem.pi
        angle = (moonlon - sunlon) % tau
        quarter = int(angle * 4.0 // tau)
        ###

        return {"phase":self.moon.moon_phase, "radius":self.moon.radius, 'direction':lunar_names[quarter][0], 'name':lunar_names[quarter][1]}

    
    # get rising/setting and noon times for the sun, including for civil, nautical and astronomical twilight
    # note that times can be datetime objects, or the strings "always" (sun never sets) or "never" (sun never rises)
    def solar_day(self, date=None):
        day = {}        
        if date is None:
            date = datetime.datetime.utcnow() 
        
        rising = local_transit('rising',  self.sun, self.here, date)         
        day['rising'] = format_date(rising)
        day['noon'] = format_date(local_transit('noon',  self.sun, self.here, rising))
        day['setting'] = format_date(local_transit('setting',  self.sun, self.here, rising))
        
        twilights = {'civil':'-6', 'nautical':'-12', 'astronomical':'-18'}
        for name, degrees in twilights.items():
            day[name] = {}                     
            day[name]['rising'] =  format_date(local_transit('rising',  self.sun, self.here, date, use_center=True, horizon=degrees))
            day[name]['setting'] =  format_date(local_transit('setting',  self.sun, self.here, date, use_center=True, horizon=degrees))
        self.here.horizon = '0'
        return day


a = Astro(lat='60:11:37', lon='-1:17:40')        
print(a.solar_day())
print(a.lunar_phase())        
print(a.transits())
print(a.locations())

