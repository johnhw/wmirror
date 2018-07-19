
function render_events(text, events, max_days)
{
    text.text(function(add)
        {
            events.forEach(function(ev)
            {
                var start_date = new Date(ev.start.date);
                var end_date = new Date(ev.end.date);
                var now = new Date();                
                // ignore events more than 30 days away
                if((start_date-now)/ 86400000 < max_days)
                {
                    var prefix;
                    // choose correct icon for this event
                    if(ev.summary.includes("birthday"))
                        prefix = "🎁"
                    else
                        prefix = "📅"
                    
                    var start_date_text = start_date.toLocaleString("en-gb", { day:"numeric", month: "long" });
                    add.tspan(prefix + "" + start_date_text + "  " + ev.summary).newLine();            
                }
            });
        }).id("text_style");        
}

widget_events = {
    init:function(bbox)
    {
        this.bbox = bbox;
        this.text = draw.text("").id("text_style").move(bbox.x, bbox.y);                     
        
    },
    update:function(json)
    {    
        var events = json.events;    
        render_events(this.text, events, config.max_event_days);
        this.text.font({"font-size":16});        
    }    
}

widget_today_events = {
    init:function(bbox)
    {
        this.bbox = bbox;
        this.text = draw.text("").id("text_style").move(bbox.x, bbox.y);                     
        
    },
    update:function(json)
    {    
        var events = json.events;    
        render_events(this.text, events, 1.0);
        this.text.font({"font-size":24});        
    }    
}


register_widget(widget_events, "future_events", ["events"]);
register_widget(widget_today_events, "today_events", ["events"]);