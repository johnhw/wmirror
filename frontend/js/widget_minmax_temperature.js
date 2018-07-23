// Simple temerature widget showing minimum/maximum temperatures for a day

widget_minmax_temperature = {
    init:function(bbox)
    {
        this.group = draw.group();
        this.text = this.group.text("");
        this.text.id("text_style");
        this.bbox = bbox;
    },

    update:function(json)
    {
        var min = 200;
        var max = -200;
        var reps = json.SiteRep.DV.Location.Period[0].Rep;
        reps.forEach(function(rep)
            {   
                if(rep.T>max) max=rep.T;
                if(rep.T<min) min=rep.T;
            });

        this.text.text("Min:" +min + "° Max:" + max+"°");
        fit_svg(this.group, this.bbox, 0.7);
    }

}

register_widget(widget_minmax_temperature, "main_temp_minmax", ["forecast"]);