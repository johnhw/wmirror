
var MS_PER_HOUR = 1000 * 60 * 60;
var MS_PER_DAY = MS_PER_HOUR * 24;


function day_name_labels(bbox, group)
{
    var timeline_bbox = get_skeleton_bbox("today_timeseries");
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];    
    date = from_today(0);
    for(var i=0;i<n_days_ahead;i++)
    {
        var midnight = new Date(date.getTime() + i * MS_PER_DAY);        
        var noon = new Date(midnight.getTime() + 12 * MS_PER_HOUR);        
        var label_pos = time_xpos(noon); // centre point of label
        var divide_pos = time_xpos(midnight); // centre point of midnight divider
        var label;
        if(i==0)
            label = "Today";
        else if (i==1)
            label = "Tomorrow";
        else
            label = days[noon.getDay()] + " " + noon.getDate();
        
        var text_label = group.text(label).id("text_style").font({"size":18});
        var tbbox = text_label.rbox();
        text_label.move(label_pos-tbbox.w/2, bbox.cy-tbbox.h/2);
        group.line(divide_pos, timeline_bbox.y, divide_pos, timeline_bbox.y2).stroke({"color":"#fff"});
    }    
}


// Simple time display
widget_day_labels = {
    init:function(bbox){                
        this.group = draw.group();        
        this.bbox = bbox;             
    },    
    update:function(json)
    {
        this.group.clear();
        day_name_labels(this.bbox, this.group);
    }
}

register_widget(widget_day_labels, "timeline_day_labels", ["date"]);
