// Tide prediction time series

// need to add high/low markers
widget_tide = {
    init:function(bbox){
        this.text = draw.text("");        
        this.time_series = new TimeSeries(label="tide", min=-0.8, max=0.8, units="m", bbox=bbox)        
        this.group = this.time_series.group;
        this.bbox = bbox;
    },

    update:function(json){
        this.time_series.update(times=json.times, y=json.heights);                 
    },
}

register_widget(widget_tide, "tide", ["tides"]);