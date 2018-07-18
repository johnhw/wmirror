
widget_date = {
        
    init:function(bbox)
    {        
        this.dateText = draw.text("")
        this.dateText.id("text_style").font({'font-size':bbox.h}).move(bbox.x, bbox.y-bbox.h/2);
    },

    update:function(json)
    {
        this.dateText.text(json.date);
    }
    
}
