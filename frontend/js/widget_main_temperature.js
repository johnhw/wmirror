
widget_main_temperature = {
    init:function(bbox)
    {
        this.text = draw.text("xxx")
        this.text.id("text_style");
        this.bbox = bbox;
    },

    update:function(json)
    {
        this.text.text(json.SiteRep.DV.Location.Period[0].Rep[0].T+"°");
        fit_svg(this.text, this.bbox, 1.2);
    }

}

register_widget(widget_main_temperature, "main_temperature", ["forecast"]);