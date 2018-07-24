// Barometric pressure 

widget_pressure = {
    init:function(bbox)
    {
        this.group = draw.group();
        this.text = this.group.text("");
        this.text.id("text_style");
        this.bbox = bbox;
    },

    update:function(json)
    {
        var last_observed = summary_weather(json, new Date(), 'observation');
        this.text.text(last_observed.P+"mB");
        fit_svg(this.group, this.bbox, 0.8);
    }
}

register_widget(widget_pressure, "main_pressure", ["forecast_observation"]);