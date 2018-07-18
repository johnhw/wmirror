
widget_date = {
        
    init:function(bbox)
    {        
        this.text = draw.text("")
        this.bbox = bbox;
        this.text.id("text_style");
    },

    update:function(json)
    {
        this.text.text(json.date);
        fit_svg(this.text, this.bbox);
    }
    
}
