
var moon_phase_names = ["New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon", "Waning gibbous", "Third quarter", "Waning crescent"]
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
            
        // outer circle for moon icon
        this.group.circle(20.0).fill("#000").stroke("#fff");

        
        date = new Date();
        angle = json.sunmoon_angle; // should be 0 -> 2*pi
        // compute sides of the arc to draw
        side = 0;
        flip = 0;        
        if(angle>Math.PI) { angle = 2*Math.PI-angle; flip=1;}
        if(angle>=0.5*Math.PI) { angle = Math.PI-angle; side=1;}
        phase = Math.max(Math.min(Math.tan(angle), 100), -100);                
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
        
        var phase_stage = Math.floor((angle / (2*Math.PI))*8);
        var name = moon_phase_names[phase_stage];

        // label with the phase
        this.group.text(name).id("text_style").move(0,26).font({"font-size":3});
    }

}

register_widget(widget_moon_icon, "main_moon", ["lunar_phase"]);