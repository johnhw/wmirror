var _MS_PER_DAY = 1000 * 60 * 60 * 24;


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
    var interpolate = (now-today_date) / _MS_PER_DAY;    
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
        // find the position on the x scale
        var xpos = time_xpos(today_date);
        var ypos = bbox.cy;
        draw.text("NOW").move(xpos, ypos).id("text_style");        
    },

    
}

register_widget(widget_time_labels, "timeline_labels", []);
