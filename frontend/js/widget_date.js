
var dateText;

function init_date()
{
    dateText = draw.text("")
    dateText.move(40,20).id("text_style").font({'font-size':80})
}

function update_date()
{
    request('/date', json => { dateText.text(json.date);}); 
}

widget_date = {"init":init_date, "update":update_date}