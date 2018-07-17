
var timeText;

widget_time = {

    "init":function(bbox){
        timeText = draw.text("");
        timeText.move(40,200).id("text_style").font({'font-size':180});
    },
    "update":function(){
        request('/time', json => { timeText.text(json.time);}); 
    },
    "rate":"second",
}
