


function image_widget()
{
    var widget =  {
        init:function(bbox){                
            this.group = draw.group();        
            this.bbox = bbox; 
        },  

        update:function(json){        
            console.log(json);
            this.group.clear();                        
            this.group.image(json.url, json.width, json.height);            
            fit_svg(this.group, this.bbox);        
        },          
    }    
    return widget;
}

register_widget(image_widget(), "solar_map", ["solar_image"]);
register_widget(image_widget(), "aurora_map", ["aurora_image"]);
