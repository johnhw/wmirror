import requests
from PIL import Image
import io
import json
import traceback

server_url = "http://localhost:8080"

json_endpoints = [    
    '/keepalive',
    '/location',
    '/date',
    '/version',
    '/time',
    '/metoffice/closest_station',
    '/metoffice/forecast',
    '/metoffice/inshore_forecast',
    '/metoffice/shipping_forecast',
    '/metoffice/text_forecast',
    '/astro/solar_day',
    '/astro/lunar_phase',
    '/astro/locations',
    '/astro/transits',
    '/astro/analemma',
    '/events',
    '/tides',    
    '/version',
    '/wifi',
    '/image/solar_image.jpg',
    '/image/aurora_prediction.jpg',
]

img_endpoints = [
    '/cached_img/solar_image.jpg',
    '/cached_img/aurora_prediction.jpg',    
]

static_endpoints = [
    '/index.html',
    '/js/widgets.js',
    '/js/utils/perspective.js',
    '/js/extern/gl-matrix-min.js',
    '/js/extern/opentype.min.js',
    '/js/extern/svg.min.js',
    '/fonts/geosanslight/geosanslight-webfont.ttf',
    '/fonts/geosanslight/geosanslight-webfont.woff2',
    '/assets/wind_arrow.svg',
    '/assets/prototype_8_skeleton.svg',
]

# JSON endpoints 
for endpoint in json_endpoints:
    try:
        result = requests.get(server_url+endpoint)
        assert(len(result.text)>1)
        assert(result.status_code==200)
        json_response = json.loads(result.text)           
        assert(len(json_response)>0)
        print(endpoint + "  OK \n\t" + " ".join(json_response.keys()))

    except Exception as e:
            print("ERROR ", endpoint)
            traceback.print_exc()

# static endpoints
for endpoint in static_endpoints:
    try:
        result = requests.get(server_url+endpoint)
        assert(len(result.text)>1)
        assert(result.status_code==200)
        print(endpoint + "  OK %d" % len(result.text))
    except Exception as e:
        print("ERROR ", endpoint)
        traceback.print_exc()


# images
for endpoint in img_endpoints:
    try:
        result = requests.get(server_url+endpoint)
        assert(len(result.content)>1)
        assert(result.status_code==200)
        result_img = Image.open(io.BytesIO(result.content))
        assert(result_img.width>1 and result_img.height>1)    
        print(endpoint + "  OK " + "size [%d %d]" % (result_img.width, result_img.height))
    except Exception as e:
        print("ERROR ", endpoint)
        traceback.print_exc()     

