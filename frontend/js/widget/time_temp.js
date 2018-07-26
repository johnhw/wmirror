// Temperature prediction time series
// need to add high/low markers

widget_temp_timeseries = {
    init:function(bbox){
        this.text = draw.text("");        
        this.time_series = new TimeSeries(label="temperature", min=-5, max=20, units="°C", bbox=bbox, margin=0.7, stair=true)   
        this.time_series.add_hline(0.0, "0°C"); // freezing point marker     
        this.group = this.time_series.group;
        this.bbox = bbox;
    },

    update:function(json){
        [times, temps] = get_weather_time(json, 'T')
        this.time_series.update(times=times, y=temps);                 
    },
}

register_widget(widget_temp_timeseries, "temp_timeseries", ["forecast_observation"]);