// Simple date widget
widget_date = {
        
    init:function(bbox)
    {        
        this.text = draw.text("");
        this.text.id("text_style");
        this.group = draw.group();
        this.group.add(this.text);
        this.bbox = bbox;                
    },

    update:function(json)
    {    
        this.text.text(json.date);                
        fit_svg(this.text, this.bbox);
    }
}

register_widget(widget_date, "date", ["date"]);