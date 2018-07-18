
widget_time = {
    init:function(bbox){
        this.text = draw.text("");
        this.text.id("text_style");
        this.bbox = bbox;
    },

    update:function(json){
        this.text.text(json.time); 
        fit_svg(this.text, this.bbox);
    },
}

register_widget(widget_time, "time", ["time"]);