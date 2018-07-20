// simple wind display, with a labeled arrow

function wind_arrow(g, speed, direction, bbox)
{
    var angles =["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", 
                 "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

    var rotation_angle = angles.indexOf(direction) * (Math.PI*2)/16.0 + Math.PI;
    
    raw_request('/assets/wind_arrow.svg', function(svg)
    {
        var wind_group = g.group();
        var icon_group = wind_group.group();     
        var icon_svg = icon_group.svg(svg);               
        icon_group.rotate(deg(rotation_angle));  
        // find centre point of arrow
        var ctr_point = SVG.get("wind_circle_centre");
        var ctr_box = ctr_point.rbox(wind_group);        
        var text = wind_group.text(speed).id("text_style").style({"fill":"#000"}).font({"size":ctr_box.w*0.65}).move(0,0);
        var tbbox = text.bbox(); 
        // move text onto it, centred
        text.move(ctr_box.cx-tbbox.cx,ctr_box.cy-tbbox.cy);           
        fit_svg(wind_group, bbox, 1.5);           
    });
}

widget_main_wind = {
    init:function(bbox)
    {        
        this.bbox = bbox;        
        this.group = draw.group();
    },

   
    update:function(json)
    {
        console.log(json);
        var direction = json.SiteRep.DV.Location.Period[0].Rep[0].D;
        var speed = json.SiteRep.DV.Location.Period[0].Rep[0].S;
        var gust = json.SiteRep.DV.Location.Period[0].Rep[0].G;        
        this.group.clear();     


        wind_arrow(this.group, speed, direction, this.bbox);
    }

}

register_widget(widget_main_wind, "main_wind", ["forecast"]);