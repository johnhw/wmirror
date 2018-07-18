
widget_time = {
    init:function(bbox){
        this.timeText = draw.text("");
        this.timeText.id("text_style").font({'font-size':bbox.h}).move(bbox.x, bbox.y-bbox.h/2);
    },
    update:function(json){
        this.timeText.text(json.time); 
    },
}
