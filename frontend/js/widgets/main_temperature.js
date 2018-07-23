// Simple temerature widget

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
        this.text.text(function(add)
        {
            add.tspan(general_forecast(json).T+"°").newLine();
            add.tspan(general_forecast(json).F+"°").newLine().fill({opacity:0.3});
        });
        fit_svg(this.group, this.bbox, 1.1);
    }

}

register_widget(widget_main_temperature, "main_temperature", ["forecast"]);