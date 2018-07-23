var MS_PER_SECOND = 1000;
var MS_PER_MINUTE = 60 * MS_PER_SECOND;
var MS_PER_HOUR = 60 * MS_PER_MINUTE;
var MS_PER_DAY = MS_PER_HOUR * 24;

// Line graph time series, with simple y axis labels
// aligned to the global time index 
class TimeSeries 
{
    constructor(label, min, max, units, bbox, margin=0.7, stair=false)
    {
        this.label = label;
        this.min = min;
        this.max = max;
        this.units = units;
        this.bbox = bbox;
        this.margin = margin;
        this.stair = stair;
        this.path = draw.polyline([]);
        this.group = draw.group();                
        this.render_base();
    }

    x(date)
    {
        return time_xpos(date);
    }
    
    y(y)
    {
        // normalised position, 0 -> 1 from min to max (but may exceed this in practice!)
        var y_norm = (y - this.min) / (this.max-this.min);
        // scale so that min and max aren't the edges of the bounding box
        // but are scaled in by the margin factor
        y_norm = ((((y_norm - 0.5) * 2) * this.margin) / 2 + 0.5);
        return this.bbox.y + this.bbox.h  - this.bbox.h * y_norm;
    }

    render_base()
    {
        // background
        draw.rect(this.bbox.w, this.bbox.h).move(this.bbox.x, this.bbox.y).fill({color:"#fff", opacity:0.05});

        // 0 line
        draw.line(0, this.y(0), this.bbox.w, this.y(0)).stroke({color:"#fff", width:1.0})
        draw.line(0, this.y(this.min), this.bbox.w, this.y(this.min)).stroke({color:"#fff", width:0.5})
        draw.line(0, this.y(this.max), this.bbox.w, this.y(this.max)).stroke({color:"#fff", width:0.5})
        var min_text = draw.text(this.min+this.units);
        var text_h = min_text.bbox().h; // note: assumes min and max labels will be same height        
        var max_text = draw.text(this.max+this.units).move(20, this.y(this.max)-text_h/2).id("text_style");
        min_text.move(20, this.y(this.min)-text_h/2).id("text_style");

    }

    update(times, ys)
    {
        this.path.remove();
        
        var path = [];
        
        for(var i=0;i<times.length;i++)
        {
            var x = time_xpos(new Date(times[i]));
            var y = this.y(ys[i]);     
            // allow for stair step graphs, as well as line graphs       
            if(this.stair && i>0)
            {
                path.push(x);
                path.push(this.y(ys[i-1]));                
            }
            path.push(x);
            path.push(y);
        }        
        this.path = draw.polyline(path).stroke({color:"#fff", width:2}).fill({color:"#000", opacity:0.4});
    }

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