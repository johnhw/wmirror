// True if a and b represent dates that are on the same
// calendar day
function same_day(a, b)
{   
    return a.getDate()===b.getDate() && a.getMonth()===b.getMonth() &&
    a.getFullYear()==b.getFullYear(); 

}

// Render a list of events, showing a prefix icon, the date, and the event summary
function render_events(text, events, max_days)
{
    text.text(function(add)
        {
            events.forEach(function(ev)
            {
                var start_date = new Date(ev.start.date);
                // end date not currently used
                var end_date = new Date(ev.end.date);
                var now = new Date();          
                // if max_days is zero, only show events
                // for today (not 24 hours from now!)
                var n_days = (start_date-now)/ 86400000;
                if((max_days===0 && same_day(start_date, now)) || (n_days<max_days))                
                {    
                    var prefix;
                    // choose correct icon for this event
                    if(ev.summary.toLowerCase().includes("birthday"))
                        prefix = config.events.birthday_icon; 
                    else
                        prefix = config.events.event_icon;         
                    
                    // remove prefix for now
                    prefix = "";

                    var start_date_text = start_date.toLocaleString("en-gb", { day:"numeric", month: "long" });
                    // don't need a label if it is today
                    if(same_day(start_date, now))  
                        start_date_text = "";
                    add.tspan(prefix + "" + start_date_text + "  " + ev.summary).newLine();            
                }
            });
        }).id("text_style");        
}

// Future events, up to config.events.max_days ahead
widget_events = {
    init:function(bbox)
    {
        this.bbox = bbox;
        this.text = draw.text("").id("text_style");
        this.group = draw.group();
        this.group.add(this.text).move(bbox.x, bbox.y);              
        
    },
    update:function(json)
    {    
        var events = json.events;    
        render_events(this.text, events, config.events.max_days);
        this.text.font({"font-size":16});        
    }    
}

// Events happening today only
widget_today_events = {
    init:function(bbox)
    {
        this.bbox = bbox;
        this.group = draw.group();
        this.text = draw.text("").id("text_style");
        this.group.add(this.text).move(bbox.x, bbox.y);  
        
    },
    update:function(json)
    {    
        var events = json.events;    
        render_events(this.text, events, 0.0);
        this.text.font({"font-size":24});        
    }    
}


register_widget(widget_events, "future_events", ["events"]);
