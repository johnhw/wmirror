
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
        this.text = draw.text("").id("text_style").move(bbox.x, bbox.y);                     
    },

    update:function(json)
    {        
        this.text.text(function(add)
        {
            add.tspan(json.general).newLine();            
            bold_dictionary(add, json.today, {"fill":"#fff"}, {"fill":"#888"});    
        });
    }    

}