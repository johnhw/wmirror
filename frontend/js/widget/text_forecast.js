// Simple text forecast block, using formatted HTML
// in an SVG foreign object block
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
            this.wrap_text.div.innerHTML += "<p> <b>"+k+"</b> "+json.today[k]+" </p>";
        }        
    }    

}


register_widget(widget_forecast, "today_forecast", ["inshore_forecast"]);