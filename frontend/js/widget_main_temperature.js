
widget_main_temperature = {
    init:function(bbox)
    {
        this.text = draw.text("xxx")
        this.text.id("text_style").font({'font-size':bbox.h}).move(bbox.x, bbox.y);
    },

    update:function(json)
    {
        this.text.text(json.SiteRep.DV.Location.Period[0].Rep[3].T+"°");
    }

}