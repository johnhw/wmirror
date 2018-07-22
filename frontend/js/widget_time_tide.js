// Tide prediction time series

// need to add high/low markers


class TimeSeries 
{
    constructor(label, min, max, units, bbox, margin=0.7)
    {
        this.label = label;
        this.min = min;
        this.max = max;
        this.units = units;
        this.bbox = bbox;
        this.margin = margin;
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
        draw.rect(this.bbox.w, this.bbox.h).move(this.bbox.x, this.bbox.y).fill({color:"#fff", opacity:0.2});

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
            path.push(x);
            path.push(y);
        }
        console.log(path);    
        this.path = draw.polyline(path).stroke({color:"#fff", width:2}).fill({color:"#000", opacity:0.2});
    }

}

widget_tide = {
    init:function(bbox){
        this.text = draw.text("");        
        this.time_series = new TimeSeries(label="tide", min=-0.8, max=0.8, units="m", bbox=bbox)        
        this.group = this.time_series.group;
        this.bbox = bbox;
    },

    update:function(json){
        console.log(json);
        this.time_series.update(times=json.times, y=json.heights);                 
    },
}

register_widget(widget_tide, "tide", ["tides"]);