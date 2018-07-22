// Simple UV level

function uv_name(uv)
{
    var scale = ["Low", "Moderate", "High", "Very High", "Extreme"];
    var name = scale[Math.min(Math.floor(uv/2-0.5), 4)];
    return name; //+ " (" + name+")";    
}

widget_uv = {
    init:function(bbox)
    {
        this.group = draw.group();
        this.text = this.group.text("");
        this.text.id("text_style");
        this.bbox = bbox;
    },

    update:function(json)
    {
        this.text.text("UV: "+uv_name(general_forecast(json).U));
        fit_svg(this.group, this.bbox, 0.75);
    }

}

register_widget(widget_uv, "main_uv", ["forecast"]);