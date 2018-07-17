
var dateText;

function init_date(bbox)
{
    dateText = draw.text("")
    dateText.move(40,20).id("text_style").font({'font-size':80})
}

function update_date()
{
    request('/date', json => { dateText.text(json.date);}); 
}
// daily means update at one second after midnight exactly
widget_date = {"init":init_date, "update":update_date, "rate":"daily"}