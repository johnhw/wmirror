// Simple temerpature widget

widget_main_temperature = {
    init:function(bbox)
    {
        this.group = draw.group();
        this.text = this.group.text("xxx");
        this.text.id("text_style");
        this.bbox = bbox;
    },

    update:function(json)
    {
        this.text.text(general_forecast(json).T+"°");
        fit_svg(this.group, this.bbox, 0.9);
    }

}

register_widget(widget_main_temperature, "main_temperature", ["forecast"]);