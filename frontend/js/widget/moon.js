// Moon phase display
// Shows current moon phase accurately


// Names of the phases, in order 0->2*pi as reported by the astro module
var moon_phase_names = ["New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon", "Waning gibbous", "Third quarter", "Waning crescent"];

widget_moon_icon = {
    init:function(bbox)
    {        
        this.bbox = bbox;        
        this.group = draw.group();
        // outer circle for moon icon        
        this.group.circle(20.0).fill("#000").stroke("#fff");
        fit_svg(this.group, this.bbox, 0.9);
        // text label, outside of bbox
        this.label_bbox = get_skeleton_bbox("main_moon_state");
        this.text = draw.text("").id("text_style").font({"font-size":14});
        this.arc = null;
    },

    update:function(json)
    {        
        var angle = json.sunmoon_angle; // should be 0 -> 2*pi
        // compute sides of the arc to draw
        var side = 0;
        var flip = 0;       
        
        // work out the quadrant... 
        if(angle>Math.PI) { angle = 2*Math.PI-angle; flip=1;}
        if(angle>=0.5*Math.PI) { angle = Math.PI-angle; side=1;}
        // unsure if tan is the right function, but seems close
        phase = Math.max(Math.min(Math.tan(angle), 100), -100);                

        // remove the old arc
        if(this.arc)
            this.arc.remove();

        if(flip)
        {
            // draw an arc top to bottom through the middle of the circle
            phase = 1+phase;
            this.arc = this.group.path("M10 0 A 1 "+phase+" 0 0 "+side+" 10 20 A 1 1 0 0 1 10 0").fill("#fff").stroke("#fff");
        }
        else
        {
            // same, but bottom to top instead
            phase = 1+phase;
            this.arc = this.group.path("M10 20 A 1 "+phase+" 0 0 "+side+" 10 0 A 1 1 0 0 1 10 20").fill("#fff").stroke("#fff");
        }
        


        // compute the name 
        var phase_stage = Math.floor((angle / (2*Math.PI))*8 + 0.5);
        if(phase_stage<0) phase_stage = 8;        
        var name = moon_phase_names[phase_stage % 8];

        // label with the phase, just outside of the icon box        
        this.text.text(name);
        fit_svg(this.text, this.label_bbox, 0.75);
    }

}

register_widget(widget_moon_icon, "main_moon", ["lunar_phase"]);