
import numpy as np 
from datetime import datetime, timedelta

def tide_predict(dates, consts, local_offset):
    # takes an array of datetimes, and a dictionary of tidal constants
    # as computed by tappy https://gitlab.ecosystem-modelling.pml.ac.uk/pica/tappy
    # outputs the predicted tide levels

    # compensate for times with negative values
    sign = 1
    if local_offset[0]=='-':
        sign = -1
        local_offset = local_offset[1:]

    t = datetime.strptime(local_offset,"%H:%M:%S")    
    delta = timedelta(hours=t.hour, minutes=t.minute, seconds=t.second) * sign    
    dates = dates + np.timedelta64(delta)
    date_offset = 2440587.5 # offset to epoch
    epoch = np.datetime64(datetime(1970,1,1))    
    # compute time to reference, in hours
    hours = 24 * ((dates-epoch)/np.timedelta64(1,'D')+date_offset) 
    
    total = np.zeros(len(hours))
    for i in consts:        
        total += consts[i]["amp"]*consts[i]["FF"]*np.cos(np.radians(consts[i]['rate'])*hours - 
                                                  np.radians(consts[i]['phase'] - consts[i]['VAU']))        
    return total