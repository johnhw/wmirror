// Sunrise/sunset times and twilights

// need to add high/low markers
widget_solar_day = {
    init:function(bbox){
            
        var f_opacity = 0.09;
        this.group = draw.group();

        periods = [
            "true",
            "civil",
            "nautical",
            "astronomical"
        ]

        this.periods = {}
        for(var i=0;i<periods.length;i++)
        {
            var period = periods[i];
            this.periods[period] = 
            {            
                box:this.group.rect(bbox.w, bbox.h).move(bbox.x, bbox.y).fill("#fff").opacity(f_opacity),
                rise_label : this.group.text("0000").id("text_style").font({"size":"15px"}),
                set_label : this.group.text("0000").id("text_style").font({"size":"15px"}),                
            };
        }
        
        this.bbox = bbox;
    },

    update:function(json){
        
        var bbox = this.bbox;
        function set_day_rect(period, section)
        {            
            
            // no sunrise at all or no sunset at all
            if(section.rising.date=='never' || section.rising.date=='always')
            {
                period.box.x(0);
                period.box.width(0);
                period.rise_label.text("");
                period.set_label.text("");
                return;
            }        
            var rise_date = new Date(section.rising.date);
            var set_date = new Date(section.setting.date);
            // compute the left and right of the highlighted box
            var left = time_xpos(new Date(rise_date));
            var right = time_xpos(new Date(set_date));
            period.box.x(left);
            period.box.width(right-left);

            // label one side of the box
            function label_side(x, label, date)
            {
                label.move(x, bbox.cy);
                var hour_mins = pad(date.getHours(),2) + ""+pad(date.getMinutes(),2);
                label.text(hour_mins);     
                var pbbox = label.bbox();
                label.dx(-pbbox.w/2).dy(-pbbox.h/2);
            }
            label_side(left, period.rise_label, rise_date);
            label_side(right, period.set_label, set_date);
            
        }

        for(k in this.periods)
        {
            set_day_rect(this.periods[k], json[k]);
        }
        
    },
}

register_widget(widget_solar_day, "timeseries_solar_day", ["solar_day"]);