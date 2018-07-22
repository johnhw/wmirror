
// add should be the result of calling draw.text(fn(add)...
// properties for keys and values are given in the props
function bold_dictionary(add, json, key_font_props, value_font_props)
{                
    for (var k in json) {
        var value = json[k];
        add.tspan(k).id("text_style").style(key_font_props).newLine();                
        add.tspan("\t"+value).id("text_style").style(value_font_props);                
    }
}





widget_forecast = {

    init:function(bbox)
    {
        this.bbox = bbox;
        this.group = draw.group();
        this.wrap_text = wrap_to_box("", bbox);
        this.wrap_text.div.id = "text_style";
        this.group.add(this.wrap_text.container);                            
    },

    update:function(json)
    {        
        
        this.wrap_text.div.innerHTML = "<p>"+json.general+"</p>";
        for(var k in json.today)
        {
            this.wrap_text.div.innerHTML += "<p> <b>"+k+"</b> &nbsp "+json.today[k]+" </p>";
        }        
    }    

}


register_widget(widget_forecast, "today_forecast", ["inshore_forecast"]);