
function fit_svg(svg_group, bbox, scaling=1)
{
    var existing_bbox = svg_group.rbox(draw);
    svg_group.move(bbox.x-existing_bbox.w/2+bbox.w/2, bbox.y-existing_bbox.h/2+bbox.h/2);
    var scale_ratio = scaling*bbox.h/existing_bbox.h;    
    svg_group.scale(scale_ratio, scale_ratio);
}

function set_icon( bbox, icon_name)
{        
    raw_request('/assets/climaticons/'+icon_name, function(svg)
    {
        var icon_group = draw.group();
        var svg_icon = icon_group.svg(svg).fill("#fff");  
        // must delete old icon somehow...
        fit_svg(icon_group, bbox, 1.5);   
    });    
}


widget_main_forecast_icon = {
    init:function(bbox)
    {        
        this.bbox = bbox;        
    },

    update:function(json)
    {
        var weather_type =json.SiteRep.DV.Location.Period[0].Rep[3].W;

        set_icon(this.bbox, icon_map.metoffice_general[weather_type].icon);
      

    }

}