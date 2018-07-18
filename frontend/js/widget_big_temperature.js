
var tempText;

function init_temp(bbox)
{
    tempText = draw.text("")
    tempText.id("text_style").font({'font-size':bbox.h}).move(bbox.x, bbox.y-bbox.h/2);
}

function update_temp()
{
    request('/forecast/dummy', json => { console.log(json) ;}); 
}

// daily means update at one second after midnight exactly
widget_temp = {"init":init_temp, "update":update_temp, "rate":"hourly"}