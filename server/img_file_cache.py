import requests
import shutil
import tempfile
import os
import time
from PIL import Image, ImageOps

tempdir = tempfile.gettempdir()

def download_file(path, cfg):    
    r = requests.get(cfg["url"], stream=True)
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
    if cfg.get("invert"):
        img = ImageOps.invert(img)
    #img = img.convert('L', matrix=[0.5,1,0,0])#.convert('rgb')
    # # rescale to target size following any crop
    img = img.resize((width, height), resample=Image.LANCZOS)
    img.save(path)

import string

def cached_file(cfg, expiry_hours):
    
    # takes a dict "cfg" which must have "url" entry specifying the actual URL
    # to download
    # allow for callbacks which return dicts, as well as direct
    # string urls
    if "url" in cfg:
        if callable(cfg["url"]):
            cfg["url"] = cfg["url"]()
        url = cfg["url"]

    fname = cfg["fname"]  

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
        # option 1: a function is provided which will write a
        # file to the given filename
        if cfg.get("fn"):
            cfg["fn"](temp_fname, cfg)
        # option 2: a url is provided, and some postprocessing
        # (e.g. resize, rotate, invert) is requested
        elif cfg.get("resize", False):            
            download_file_resize(temp_fname, cfg)    
        else:
            # just a plain download
            download_file(temp_fname, cfg)    
    return temp_fname
        