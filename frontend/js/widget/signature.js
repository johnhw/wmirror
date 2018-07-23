// version number 

widget_signature = {
    init:function(bbox){
        this.text = draw.text("JHW 2018");
        this.text.id("text_style");
        this.group = draw.group();
        this.group.add(this.text);
        this.bbox = bbox;        
    },
    
    update:function(json){        
        this.text.text(function(add)
        {
            add.tspan("JHW 2018 ").newLine();
            add.tspan("v."+json.date+" "+json.sha).newLine();
        });
        fit_svg(this.text, this.bbox, 0.75);
    },
}


register_widget(widget_signature, "signature", ["version"]);
