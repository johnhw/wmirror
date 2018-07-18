

widget_moon_icon = {
    init:function(bbox)
    {        
        this.bbox = bbox;        
        this.group = draw.group();
    },

    update:function(json)
    {
        console.log(json);
//        draw.remove(this.group);
        this.group = draw.group();
            
        
        this.group.circle(20.0).fill("#000").stroke("#fff");

        
        date = new Date();

        angle = json.sunmoon_angle; // should be 0 -> 2*pi
    
        side = 0;
        flip = 0;
        
        if(angle>Math.PI) { angle = 2*Math.PI-angle; flip=1;}
        if(angle>=0.5*Math.PI) { angle = Math.PI-angle; side=1;}
        phase = Math.max(Math.min(Math.tan(angle), 100), -100);
        console.log("***", angle, phase);

        
        if(flip)
        {
            phase = 1+phase;
            this.group.path("M10 0 A 1 "+phase+" 0 0 "+side+" 10 20 A 1 1 0 0 1 10 0").fill("#fff").stroke("#fff");
        }
        else
        {
            phase = 1+phase;
            this.group.path("M10 20 A 1 "+phase+" 0 0 "+side+" 10 0 A 1 1 0 0 1 10 20").fill("#fff").stroke("#fff");
        }

        fit_svg(this.group, this.bbox);
    }

}

register_widget(widget_moon_icon, "main_moon", ["lunar_phase"]);