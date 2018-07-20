
function set_icon( bbox, icon_name, group, scale=1.5)
{        
    raw_request('/assets/climaticons/'+icon_name, function(svg)
    {
        var icon_group = group.group();
        var svg_icon = icon_group.svg(svg).id("icon_style");                
        var box = icon_group.bbox();        
        group.rect(100,100).fill('none');
        
        fit_svg(group, bbox, scale);   
        return svg_icon;
    });    
}

widget_main_forecast_icon = {
    init:function(bbox)
    {        
        this.bbox = bbox;        
        this.group = draw.group();
    },

    update:function(json)
    {
        var weather_type =json.SiteRep.DV.Location.Period[0].Rep[0].W;
        this.group.select("*").remove();        
        set_icon(this.bbox, icon_map.metoffice_general[weather_type].icon, this.group);      
    }

}

register_widget(widget_main_forecast_icon, "main_forecast_icon", ["forecast"]);