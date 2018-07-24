
// Construct a new image widget, that shows the synoptic map.
//  Image dimensions are reported by
widget_synoptic ={
    
        init:function(bbox){                
            this.group = draw.group();        
            this.bbox = bbox; 
        },  

        update:function(json){                            
            this.group.clear();                  
            var latest_map_url = json.map[0].image_url;
            this.group.image(latest_map_url, 891, 601);            
            fit_svg(this.group, this.bbox);        
        },              
}

register_widget(widget_synoptic, "synoptic_map", ["synoptic_map"]);

