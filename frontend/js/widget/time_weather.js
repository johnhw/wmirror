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
        this.group.clear();     
        var bbox = this.bbox;             
        var group = this.group;    
        function show_weather_icons(json)
        {
            date = from_today(0);
            [times, weathers] = get_weather_time(json, 'W')

            for(var i=0;i<times.length;i++)
            {   
                // compensate for metoffice forecasts being off by one from the three hour
                // schedule we expect                                                     
                var hour_date = new Date(times[i].getTime() - MS_PER_HOUR);
                var xpos = time_xpos(hour_date); // centre point of label                
                var ypos = bbox.cy;        
                var h = bbox.h;
                var hour = (hour_date-date) / MS_PER_HOUR;                
                h = h / 1.5;
                if(is_tick(hour))
                {
                    if(is_minor_tick(hour))
                    {
                        h = h / 2.0;                        
                    }                        
                    // fit the icon into the right space on the timeline slot
                    var box = {x:xpos-h/2, x2:xpos+h/2, w:h, cx:xpos,
                            y:ypos-h/2, y2:ypos+h/2, h:h, cy:ypos};     
                    var g = group.group();
                    set_icon(box, icon_map.metoffice_general[weathers[i]].icon, g);      
                }
            }
            
        }        
        show_weather_icons(json);        
    }
}

register_widget(widget_time_weather, "time_forecast", ["forecast_observation"]);