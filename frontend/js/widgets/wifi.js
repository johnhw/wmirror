// Simple WiFi connected status box
widget_wifi = {
    init:function(bbox){
        this.bbox = bbox;        
        this.text = wrap_to_box("", this.bbox);
        this.text.container.id("text_style");
        this.text.container.style("font-size:40px");
        this.group = draw.group();
        this.group.add(this.text.container);
        
    },

    update:function(json){
        var icon;
        if(json.connected)
            icon = "wifi";
        else
            icon = "ban";
        
        this.text.div.innerHTML='<i class="fas fa-'+icon+'"></i> '+json.ssid;        
        fit_svg(this.group, this.bbox);
    },
}

register_widget(widget_wifi, "wifi", ["wifi"]);