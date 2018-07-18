
var timeText;

widget_time = {

    "init":function(bbox){
        timeText = draw.text("");
        timeText.id("text_style").font({'font-size':bbox.h}).move(bbox.x, bbox.y-bbox.h/2);
    },
    "update":function(){
        request('/time', json => { timeText.text(json.time);}); 
    },
    "rate":"second",
}
