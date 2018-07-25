
var MS_PER_HOUR = 1000 * 60 * 60;
var MS_PER_DAY = MS_PER_HOUR * 24;


function day_labels(bbox)
{
    var g = draw.group();
    var all_ticks = major_ticks.concat(minor_ticks);
    
    // the bounding box of the time widget
    var time_bbox = get_skeleton_bbox("time");
    var timeline_bbox = get_skeleton_bbox("today_timeseries");
    
    date = from_today(0);
    all_ticks.forEach(function(hour_offset)
    {
        var hour_date = new Date(date.getTime() + hour_offset * MS_PER_HOUR);        
        var xpos = time_xpos(hour_date); // centre point of label
        var ypos = bbox.cy;        
        var text_label = draw.text(pad(hour_offset % 24,2)+"00").id("text_style");
        var font_size;

        if(is_minor_tick(hour_offset))
        {
            font_size = 14;
            opacity = 0.05;
            
        }
        else
        {
            font_size = 24;
            opacity = 0.1;
        }
        // solid line at end of day
        if(hour_offset % 24==0)
        {
            opacity = 1.0;
        }
        
        draw.line(xpos, timeline_bbox.y, xpos, timeline_bbox.y2).stroke({color:"#fff", opacity:opacity});
        text_label.font({"size":font_size});
        var tbbox = text_label.bbox();
        // centre the text
        text_label.move(xpos-tbbox.w/2, ypos-tbbox.h/2);        
        g.add(text_label);
    });
    return g;
}


// Simple time display
widget_time_labels = {
    init:function(bbox){                
        this.group = draw.group();        
        this.bbox = bbox;
        day_labels(bbox);
     
    },    
}

register_widget(widget_time_labels, "timeline_labels", []);
