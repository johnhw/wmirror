function formatLocation(json)
    {
        lat = json.lat;
        lon = json.lon;
        if(lon[0]<0)
        {
            ew = 'W'
            lon[0] = -lon[0]
        }
        else
        {
            ew = 'E'
        }
        if(lat[0]<0)
        {
            ns = 'S'
            lat[0] = -lat[0]
        }
        else
        { 
            ns = 'N'
        }
        return lat[0] + "°" + lat[1]+" ′" + lat[2] + '″' + ns + "  " + lon[0] + "°" + lon[1]+"′" + lon[2] + '″' + ew;        
    }

function update_location()
{

}

function init_location(bbox)
{
    locationText = draw.text("");
    locationText.id("text_style").font({'font-size':bbox.h}).move(bbox.x, bbox.y-bbox.h/2);

    request('/location', json => locationText.text(formatLocation(json)));
}

widget_location = {"update":update_location, "init":init_location}    