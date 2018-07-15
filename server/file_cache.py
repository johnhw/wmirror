import requests
import shutil
import tempfile
import os
import time


tempdir = tempfile.gettempdir()


def download_file(path, url):    
    r = requests.get(url, stream=True)
    with open(path, 'wb') as f:
        shutil.copyfileobj(r.raw, f)


def cached_file(url, expiry_hours):
    fname = url.split('/')[-1]
    temp_fname = os.path.join(tempdir, fname)
    stale = False
    
    # check if there is a cached version, and how old it is on disk
    if os.path.exists(temp_fname):
        age = time.time() - (os.path.getmtime(temp_fname))
        age_hours = age / (60*60)
        if age_hours>expiry_hours or age_hours<0:
            stale = True
    else:
        stale = True
    
    if stale:    
        download_file(temp_fname, url)    
    return temp_fname
        