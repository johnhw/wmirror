
  function bold_dictionary(json, key_font_props, value_font_props)
    {        
        var dict_text = draw.text(function(add) {
            for (var k in json) {
                var value = json[k];
                var left = add.tspan(k).id("text_style").font(key_font_props).newLine();                
                add.tspan("\t"+value).id("text_style").style(value_font_props);                
            }
                });    
        return dict_text;            
    }
    
config = {inshore_area:"iw18"}

function init_forecast(bbox)
{
    request("/metoffice/inshore_forecast/"+config.inshore_area, json=>{

        draw.text(json["general"]).id("text_style").move(bbox.x, bbox.y);        
        bold_dictionary(json['today'], {"fill":"#fff"}, {"fill":"#888"}).move(bbox.x, bbox.y+40);
        //bold_dictionary(json['tomorrow'], {"fill":"#fff"}, {"fill":"#888"}).move(200,500);
    
    });
    
}

function update_forecast()
{

}    

widget_forecast = {"init":init_forecast, "update":update_forecast, "rate":"hourly"}