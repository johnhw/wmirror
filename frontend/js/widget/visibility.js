// Graphical visibility indicator
// Shades land according to how visible it is
function get_visibility(json)
{
    var vis = json.V;
    var weather = json.W;
    // special case: if there is fog, it's worse than 1km visibility!
    if(weather==6) // Fog
        vis = "FG";
    if(weather==5) // mist
        vis = "MS";   
    return vis;
}

function sigmoid(x) 
{
    return 1.0 / (1+Math.exp(x));
}

// mapping from metoffice codes to visibility distances, in km
visibility_distances = 
{
    'FG':0.4,
    'MS':0.6,
    'VP':1.0,
    'UN':0.0,
    'PO':4.0,
    'MO':10,
    'GO':20,
    'VG':40,
    'EX':200,
}

// Human readable names for the visibility codes
visibility_names = 
{
    'FG':"Fog",
    'MS':"Misty",
    'VP':"Very poor",
    'UN':"Unknown",
    'PO':"Poor",
    'MO':"Moderate",
    'GO':"Good",
    'VG':"Very good",
    'EX':"Excellent",
}


widget_visibility = {
    init:function(bbox)
    {
        var group = draw.group();
        var distance_table = {};
        this.distance_table = distance_table;
        // Label each group according to its true distance
        raw_request('/assets/voe2.svg', function(svg)
        {
            var vis_drawing = group.svg(svg);
            distances = {
                '45':SVG.get('km45'),
                '11':SVG.get('km11'),
                '7':SVG.get('km7'),
                '4':SVG.get('km4'),
                '2':SVG.get('km2'),
                '1.5':SVG.get('km1.5'),
                '0.8':SVG.get('km0.8'),
                '0.6':SVG.get('km0.6'),
                '1.0':SVG.get('km1.0'),                
            }
            distance_table.distances = distances;
        });
        this.bbox = bbox;        
        this.group = group;
    },

    // update the visibility of each landmass region
    update:function(json)
    {        
        var vis = get_visibility(general_forecast(json));        
        var vis_distance = visibility_distances[vis];
        for(var k in distances)
        {
            var d = parseFloat(k);     
            // compute visibility of the region at this distance and set opacity accordingly
            var obscured = sigmoid((d-vis_distance/3)/(vis_distance/3));                        
            distances[k].fill({opacity:obscured});
        }
        fit_svg(this.group, this.bbox, 1.0);
    }
}

// Simple visibility text

widget_vis_text = {
    init:function(bbox)
    {
        this.group = draw.group();
        this.text = this.group.text("");
        this.text.id("text_style");
        this.bbox = bbox;
    },

    update:function(json)
    {
        var vis = get_visibility(general_forecast(json));
        this.text.text("Visibility: "+visibility_names[vis]);
        fit_svg(this.group, this.bbox, 0.75);
    }

}

register_widget(widget_vis_text, "main_vis", ["forecast"]);

register_widget(widget_visibility, "main_visibility", ["forecast"]);