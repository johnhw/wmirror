
var dateText;

function init_date(bbox)
{
    dateText = draw.text("")
    dateText.id("text_style").font({'font-size':bbox.h}).move(bbox.x, bbox.y-bbox.h/2);
}

function update_date()
{
    request('/date', json => { dateText.text(json.date);}); 
}
// daily means update at one second after midnight exactly
widget_date = {"init":init_date, "update":update_date, "rate":"daily"}