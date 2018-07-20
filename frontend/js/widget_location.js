

function formatLocation(json)
    {
        lat = json.lat;
        lon = json.lon;
        // convert signed sexigesimal lat lon to deg'min''secZ format
        if(lon[0]<0) 
        {
            ew = 'W';
            lon[0] = -lon[0];
        }
        else
        {
            ew = 'E';
        }
        if(lat[0]<0)
        {
            ns = 'S';
            lat[0] = -lat[0];
        }
        else
        { 
            ns = 'N';
        }
        return lat[0] + "°" + lat[1]+" ′" + lat[2] + '″' + ns + "  " + lon[0] + "°" + lon[1]+"′" + lon[2] + '″' + ew;        
    }


widget_location = 
{
    init:function(bbox){
        this.group = draw.group()
        this.text = this.group.text("");
        this.text.id("text_style");
        this.bbox = bbox;                
    },

    update:function(json){        
        this.text.text(formatLocation(json));
        fit_svg(this.group, this.bbox, 0.8);
        
    }
    
}

register_widget(widget_location, "location", ["location"]);
