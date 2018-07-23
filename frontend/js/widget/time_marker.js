

// Simple indication of the current time as a line across the time series, linked to the time display
widget_time_marker = {

    init:function(bbox){                
        this.group = draw.group();        
        this.bbox = bbox; 

        // the bounding box of the time widget
        this.time_bbox = get_skeleton_bbox("time");
        var days = today_tomorrow();
        [0,3,6,9,12,15,18,21,24,30,36,42].forEach(function(hour_offset)
        {
            var hour_date = new Date(days.today.getTime() + hour_offset * MS_PER_HOUR);        
            var xpos = time_xpos(hour_date); 
            var opacity;            
            if(((hour_offset/3)%2)===1)
            {
                opacity = 0.05;
            }
            else
            {
                opacity = 0.1;
            }
            // solid line at end of day
            if(hour_offset % 24==0)
            {
                opacity = 1.0;
            }
            draw.line(xpos, bbox.y, xpos, bbox.y2).stroke({color:"#fff", opacity:opacity});
     
        });
    },

    update:function(json){                
        this.group.clear();
        var now = Date.now();
        var x = time_xpos(now);        
        this.group.line(x, this.bbox.y, x, this.bbox.y2).stroke({"color":"#fff", "width":2});             
        // line to the time widget        
        this.group.line(x, this.bbox.y, this.time_bbox.cx, this.time_bbox.y2).stroke({"color":"#fff", "width":2});             
        this.group.line(this.time_bbox.cx, this.time_bbox.y2, this.time_bbox.cx, this.time_bbox.y2-10).stroke({"color":"#fff", "width":2});             
        this.group.rect(20, this.bbox.h).move(-10+x, this.bbox.y).fill({"color":"#fff", "opacity":0.1});     
        
    },  

}

register_widget(widget_time_marker, "today_timeseries", ["time"]);
