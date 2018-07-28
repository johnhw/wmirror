// Weather icon strip
// Shows icons for the weather every three hours along the timeline strip
widget_time_wind = {
    init:function(bbox)
    {        
        this.bbox = bbox;        
        this.group = draw.group();
    },

    update:function(json)
    {
        this.group.clear();     
        var strip_bbox = this.bbox;             
        var group = this.group;    
        function show_wind_icons(json)
        {
            date = from_today(0);
            [times, speeds] = get_weather_time(json, 'S');
            [times, directions] = get_weather_string(json, 'D');
            [times, gusts] = get_weather_time(json, 'G');

            for(var i=0;i<times.length;i++)
            {   
                // compensate for metoffice forecasts being off by one from the three hour
                // schedule we expect                                                     
                var hour_date = new Date(times[i].getTime() - MS_PER_HOUR);
                var xpos = time_xpos(hour_date); // centre point of label                
                var ypos = strip_bbox.cy;        
                var h = strip_bbox.h;
                var hour = (hour_date-date) / MS_PER_HOUR;                
                h = h / 4;
                // render each arrow
                if((is_major_tick(hour) || is_minor_tick(hour)) && xpos)
                {
                    arrow_bbox = {"x":xpos-h, "y":strip_bbox.cy-h, "x2":xpos+h, "y2":strip_bbox.cy+h, "w":h*2, "h":h*2, "cx":xpos, "cy":strip_bbox.cy};                    
                    var g = group.group();
                    
                    wind_arrow(g, speeds[i], directions[i], arrow_bbox);
                }
            }
            
        }        
        show_wind_icons(json);        
    }
}

register_widget(widget_time_wind, "wind_timeseries", ["forecast_observation"]);