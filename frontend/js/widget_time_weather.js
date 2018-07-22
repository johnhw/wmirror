// Weather icon strip
// Shows icons for the weather every three hours along the timeline strip
widget_time_weather = {
    init:function(bbox)
    {        
        this.bbox = bbox;        
        this.group = draw.group();
    },

    update:function(json)
    {
        this.group.select("*").remove();     
        var bbox = this.bbox;             
        var group = this.group;    
        function show_weather_icons(date, period, skip_small)
        {
            
            period.Rep.forEach(function(report)
            {                        
                var minute_offset = parseFloat(report["$"]);
                var hour_date = new Date(date.getTime() + minute_offset * MS_PER_MINUTE);        
                var xpos = time_xpos(hour_date); // centre point of label                
                var ypos = bbox.cy;        
                var h = bbox.h;
                var hour = Math.floor(minute_offset/60);
                h = h / 1.5;
                // make intermediate hours smaller                
                if((hour/3)%2==1)
                {
                    h = h / 2.0;
                    if(skip_small) return; // skip small icons if requested
                }
                // fit the icon into the right space on the timeline slot
                var box = {x:xpos-h/2, x2:xpos+h/2, w:h, cx:xpos,
                        y:ypos-h/2, y2:ypos+h/2, h:h, cy:ypos};     
                var g = group.group();
                set_icon(box, icon_map.metoffice_general[report.W].icon, g);      
            });                

        }        
        show_weather_icons(today_tomorrow().today, json.SiteRep.DV.Location.Period[0], skip_small=false);
        show_weather_icons(today_tomorrow().tomorrow, json.SiteRep.DV.Location.Period[1], skip_small=true);        
    }
}

register_widget(widget_time_weather, "time_forecast", ["forecast"]);