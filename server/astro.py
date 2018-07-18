import ephem
import math
import datetime
from datetime import timedelta

def local_transit(transit, body, location, date, horizon='0', use_center=False):
    # deal with sun never coming up/going down
    # special cases: sun is always up or always down
    if date=='always':
        return 'always'
    if date=='never':
        return 'never'
    
    location.date = date
    location.horizon = horizon
    transit_fn = {"noon":location.next_transit, 
    "rising":location.previous_rising, 
    "setting":location.next_setting}[transit]    
    try:
        if use_center:
            time = ephem.localtime(transit_fn(body, use_center=use_center))
        else:
            time = ephem.localtime(transit_fn(body))
        return time
    except ephem.AlwaysUpError:
        # polar regions, in polar summer
        return 'always'
    except ephem.NeverUpError:
        # polar regions, in polar winter
        return 'never'
    

def format_date(body, here, date):
    # convert special string dates without modification
    if type(date)==type(""):
        return {"date":date, "alt":"0.0", "az":"0.0"}
    else:
        here.date = date
        body.compute(here)
    # convert to isoformat date
        return {"date":date.isoformat(), "alt":body.alt, "az":body.az}

class Astro:
    def __init__(self, lon, lat, elev=0):
        #self.here = ephem.Observer()
        self.lon = lon
        self.lat = lat
        self.sun = ephem.Sun()
        self.moon = ephem.Moon()
        
    def locations(self, date=None):
        if date is None:
            date = datetime.datetime.utcnow() 
        here = ephem.Observer()
        here.lat = self.lat
        here.lon = self.lon
        here.date = date
        
        self.moon.compute(here)
        self.sun.compute(here)
        return {"moon": {"time":ephem.localtime(ephem.date(date)).isoformat(), "alt":self.moon.alt, "az":self.moon.az},
        "sun": {"time":ephem.localtime(ephem.date(date)).isoformat(), "alt":self.sun.alt, "az":self.sun.az}}
        
    def solar_analemma(self, date=None):
        # compute the position of the sun at each point day in the year
        # at this exact time
        if date is None:
            date = datetime.datetime.utcnow() 
        here = ephem.Observer()
        here.lat = self.lat
        here.lon = self.lon
        here.date = date                       
        solar_analemma = []
        # ignoring leap years...
        for i in range(365):
            self.sun.compute(here)
            solar_analemma.append({"time":ephem.localtime(ephem.date(here.date)).isoformat(), "alt":self.sun.alt, "az":self.sun.az})
            here.date += 1
        return {"sun":solar_analemma}

    def transits(self, date=None, n=240):
        # compute path of sun and moon across the whole day
        if date is None:
            date = datetime.datetime.utcnow()                 
        
        morning = ephem.date(date.date()) # chop off time 
        evening = ephem.date(date.date()+timedelta(hours=24)) # add one full day
        lunar_transit = []
        solar_transit = []
        here = ephem.Observer()
        here.lat = self.lat
        here.lon = self.lon
            
        for i in range(n):
            time = (morning) + (evening-morning)*(i/(n-1))
            here.date = time
        
            self.moon.compute(here)
            self.sun.compute(here)

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
        here = ephem.Observer()
        here.lat = self.lat
        here.lon = self.lon
        here.date = date
        self.moon.compute(here)
        self.sun.compute(here)

        # lunar name computation from
        # https://stackoverflow.com/questions/26702144/human-readable-names-for-phases-of-the-moon-with-pyephem
        sunlon = ephem.Ecliptic(self.sun).lon
        moonlon = ephem.Ecliptic(self.moon).lon
        tau = 2.0 * ephem.pi
        angle = (moonlon - sunlon) % tau
        quarter = int(angle * 4.0 // tau)
        ###

        return {"phase":self.moon.moon_phase, "radius":self.moon.radius, 'direction':lunar_names[quarter][0], 'name':lunar_names[quarter][1]}

    def solar_day(self, date=None):
        return self.day(self.sun, date)

    # get rising/setting and noon times for the sun, including for civil, nautical and astronomical twilight
    # note that times can be datetime objects, or the strings "always" (sun never sets) or "never" (sun never rises)
    def day(self, body, date=None):
        day = {}        
        if date is None:
            date = datetime.datetime.utcnow() 
        here = ephem.Observer()
        here.lat = self.lat
        here.lon = self.lon
        here.date = date
        rising = local_transit('rising',  body, here, date)         
        day['rising'] = format_date(body, here, rising)
        day['noon'] = format_date(body, here, local_transit('noon',  self.sun, here, rising))
        day['setting'] = format_date(body, here, local_transit('setting',  self.sun, here, rising))
        
        # compute the set/rise times for twilights
        twilights = {'civil':'-6', 'nautical':'-12', 'astronomical':'-18'}
        for name, degrees in twilights.items():
            day[name] = {}                     
            day[name]['rising'] =  format_date(body, here, local_transit('rising',  self.sun, here, date, use_center=True, horizon=degrees))
            day[name]['setting'] =  format_date(body, here, local_transit('setting',  self.sun, here, date, use_center=True, horizon=degrees))
        here.horizon = '0'
        return day

if __name__=="__main__":
    a = Astro(lat='60:11:37', lon='-1:17:40')        
    print(a.solar_day())
    print(a.lunar_phase())        
    print(a.transits())
    print(a.locations())
    print(a.solar_analemma())
