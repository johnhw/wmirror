
  function bold_dictionary(json, key_font_props, value_font_props)
    {        
        var dict_text = draw.text(function(add) {
            for (var k in json) {
                var value = json[k];
                add.tspan(k).id("text_style").font(key_font_props).newLine();
                add.tspan(value).id("text_style").style(value_font_props).x(300);                
            }
                });    
        return dict_text;            
    }

function init_forecast(bbox)
{

}

function update_forecast()
{
 request("/metoffice/localforecast", json=>{
        bold_dictionary(json['today'], {"fill":"#fff"}, {"fill":"#888"}).move(200,400);
        bold_dictionary(json['tomorrow'], {"fill":"#fff"}, {"fill":"#888"}).move(200,500);
        draw.text(json["general"]).id("text_style").move(200, 350);        
    });
}    

widget_forecast = {"init":init_forecast, "update":update_forecast, "rate":"hourly"}