
// Storm force display

storm_force = [
    {name:'Calm', max_mph:0, wave_height_m:0}, // waveheight in m
    {name:'Light air', max_mph:3, wave_height_m:0.2},
    {name:'Light breeze', max_mph:7, wave_height_m:0.5},
    {name:'Gentle breeze', max_mph:12, wave_height_m:1.0},
    {name:'Moderate breeze', max_mph:18, wave_height_m:2},
    {name:'Fresh breeze', max_mph:24, wave_height_m:3},
    {name:'Strong breeze', max_mph:31, wave_height_m:4},
    {name:'Near gale', max_mph:38, wave_height_m:5.5},
    {name:'Gale', max_mph:46, wave_height_m:7.5},
    {name:'Severe gale', max_mph:54, wave_height_m:10},
    {name:'Storm', max_mph:63, wave_height_m:12.5},
    {name:'Violent storm', max_mph:72, wave_height_m:16},
    {name:'Hurricane 1', max_mph:95, wave_height_m:16},
    {name:'Hurricane 2', max_mph:110, wave_height_m:16},
    {name:'Hurricane 3', max_mph:129, wave_height_m:16},
    {name:'Hurricane 4', max_mph:156, wave_height_m:16},
    {name:'Hurricane 5', max_mph:174, wave_height_m:16},
    {name:'Hurricane 6', max_mph:300, wave_height_m:16},
]
    
// Change a MPH wind speed into storm force report
function get_storm_force(mph)
{
    var i;    
    for(i=1;i<storm_force.length;i++)
    {
        if(mph<storm_force[i].max_mph)
        {
            return {force:i, name:storm_force[i-1].name, wave_height_m:storm_force[i-1].wave_height_m}
        }
    }    
}


widget_storm_force = {
    init:function(bbox){
        this.text = draw.text("");
        this.text.id("text_style");
        this.group = draw.group();
        this.group.add(this.text);
        this.bbox = bbox;
    },

    update:function(json){
        var wind = general_forecast(json).W;
        var storm = get_storm_force(wind);
        var storm_force_text =  storm.name;        
        this.text.text(storm_force_text);
        // adjust colour depending on storm force
        if(storm.force<=6)
            this.text.fill("#fff")
        if(storm.force>6)
            this.text.fill("#ff8")
        if(storm.force>8)
            this.text.fill("#f00")            
        fit_svg(this.group, this.bbox, 0.75);
    },
}

register_widget(widget_storm_force, "main_stormforce", ["forecast"]);