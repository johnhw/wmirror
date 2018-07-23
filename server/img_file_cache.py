import requests
import shutil
import tempfile
import os
import time
from PIL import Image

tempdir = tempfile.gettempdir()


def download_file(path, url):    
    r = requests.get(url, stream=True)
    with open(path, 'wb') as f:
        shutil.copyfileobj(r.raw, f)

def download_file_resize(path, cfg):    
    # download the image, resize to the given size
    # (w/hq filter) and save again
    url, width, height = cfg["url"], cfg["width"], cfg["height"]
    crop = cfg.get("crop")    
    r = requests.get(url, stream=True)
    img = Image.open(r.raw)
    # crop if required
    if crop:
        img = img.crop(crop)
    if cfg.get("rotate"):
        img = img.rotate(cfg["rotate"])

    #img = img.convert('L', matrix=[0.5,1,0,0])#.convert('rgb')
    # # rescale to target size following any crop
    img = img.resize((width, height), resample=Image.LANCZOS)
    img.save(path)


def cached_file(cfg, expiry_hours):
    print(tempdir)
    # takes a dict "cfg" which must have "url" entry specifying the actual URL
    # to download
    # allow for callbacks which return dicts, as well as direct
    # string urls
    if callable(cfg):
        cfg = cfg()

    url = cfg["url"]
    fname = url.split('/')[-1]
    temp_fname = os.path.join(tempdir, fname)
    stale = True
    
    # check if there is a cached version, and how old it is on disk
    if os.path.exists(temp_fname):
        age = time.time() - (os.path.getmtime(temp_fname))
        age_hours = age / (60*60)
        if age_hours>expiry_hours or age_hours<0:
            stale = True
    else:
        stale = True
    
    if stale:    
        if cfg.get("resize", False):            
            download_file_resize(temp_fname, cfg)    
        else:
            download_file(temp_fname, url)    
    return temp_fname
        