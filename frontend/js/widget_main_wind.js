

widget_main_wind = {
    init:function(bbox)
    {        
        this.bbox = bbox;        
        this.group = draw.group();
    },

    angles:["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],

    update:function(json)
    {
        var direction =json.SiteRep.DV.Location.Period[0].Rep[3].D;
        var speed =json.SiteRep.DV.Location.Period[0].Rep[3].S;
        var gust =json.SiteRep.DV.Location.Period[0].Rep[3].G;        
        var rotation_angle = this.angles.indexOf(direction) * (Math.PI*2)/16.0 + Math.PI;
        console.log(direction);
        this.group.clear();     
        var g = this.group;   
        var bbox = this.bbox;
        raw_request('/assets/wind_arrow.svg', function(svg)
        {
            var icon_group = g.group();     
            icon_group.svg(svg);       
            
            fit_svg(icon_group, bbox, 1.5);   
            icon_group.rotate(deg(rotation_angle));         
            text_at(speed, [bbox.cx, bbox.cy], 50).id("text_style").style({"fill":"#000"});   
        });

      

    }

}

register_widget(widget_main_wind, "main_wind", ["forecast"]);