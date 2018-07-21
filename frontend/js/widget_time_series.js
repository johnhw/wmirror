
var MS_PER_HOUR = 1000 * 60 * 60;
var MS_PER_DAY = MS_PER_HOUR * 24;

// end

var today_ts_bbox, tomorrow_ts_bbox;
function init_timeseries()
{
    today_ts_bbox =  SVG.get("today_timeseries").rbox();
    tomorrow_ts_bbox = SVG.get("tomorrow_timeseries").rbox();
    console.log(today_ts_bbox);
}

// Return the x position of the data for the given date
// which should be a time in either today or tomorrow
function time_xpos(date)
{

    var now = new Date(Date.now());
    var today_date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // period through the day, as a value 0.0 -> 1.0
    var interpolate = (date-today_date) / MS_PER_DAY;     
    // today
    if(interpolate<1.0)
    {        
        return today_ts_bbox.x + interpolate * today_ts_bbox.w;
    }
    else if (interpolate<2.0)
    {
        return tomorrow_ts_bbox.x + (interpolate-1.0) * tomorrow_ts_bbox.w;
    }
    else 
        return null;

}

function day_labels(date, bbox)
{
    var g = draw.group();
    [0,3,6,9,12,15,18,21,24,30,36,42].forEach(function(hour_offset)
    {
        var hour_date = new Date(date.getTime() + hour_offset * MS_PER_HOUR);
        
        var xpos = time_xpos(hour_date); // centre point of label
        var ypos = bbox.cy;
        
        var text_label = draw.text(pad(hour_offset % 24,2)+"00").id("text_style");
        var font_size;
        // Set labels so that intermediate hours (e.g. 0300) appear smaller
        if(((hour_offset/3)%2)===1)
        {
            font_size = 14;
        }
        else
        {
            font_size = 24;
        }
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
        var date = new Date(Date.now());
        // compute the date objects for 00:00 today and tomorrow
        var today_date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        var tomorrow = new Date(today_date.valueOf());
        tomorrow.setDate(tomorrow.getDate()+1);                
        day_labels(today_date, bbox);
     
    },    
}

register_widget(widget_time_labels, "timeline_labels", []);
