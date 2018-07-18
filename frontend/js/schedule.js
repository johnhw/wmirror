
// sources of data, fetched with request
// json passed to the update function when updates happen
// update always happens at launch, then on the schedule
// given. updates always happen at most 1 second past the 
// turnover for that period (e.g. daily between 00:00:00 and 00:00:01)
data_sources = {
    'forecast' : {
        url:'/metoffice/forecast/'+config.station_id,
        update:'hour',
        deps:['main_temperature']
    },
    'time' : {
        url:'/time',
        update:'minute',
        deps:["time"]
    },
    'date' : {
        url:'/date',
        update:'day',
        deps:["date"]
    },
    'inshore_forecast' : 
    {
        url:'/metoffice/inshore_forecast/'+config.inshore_area,
        update:'hour',
        deps:["today_forecast"],
    },
    'locations' : 
    {
        url:'/astro/locations',
        update:'minute',
        deps:["astro_locations"],
    },
    'transits' : 
    {
        url:'/astro/transits',
        update:'day',
        deps:["astro_transits"],
    },
    'solar_day' : 
    {
        url:'/astro/solar_day',
        update:'day',
        deps:["astro_day", "day_timeseries"],
    },
    'analemma' : 
    {
        url:'/astro/analemma',
        update:'minute',
        deps:["astro_analemma"],
    },
    'keepalive' : 
    {
        url:'keepalive',
        update:'second',
        deps:["heartbeat"],
    }  
}

// initially, nothing has been latched; will be updated
// in schedule_fetch
var schedule_latches = {}

function update_datasource(data)
{
    // fetch data (even if no deps)
    request(data.url, function(json)
        {             
            data.json = json; // cache data                  
            //update required, find dependent widgets
            if(data.deps)
            {                    
                data.deps.forEach(function(dep)
                {                        
                    var update_widget = widgets[dep];                    
                    if(update_widget)
                    {
                        console.log(update_widget, data.json);
                        // pass the JSON for this update to the widget that depends on it
                        try
                        {
                            update_widget.update(data.json);
                        }
                        catch(err)
                        {
                            console.log(err);
                        }
                    }
                });
            }
        });
}

function schedule_fetch()
{
    //Check the time; see what flags need updating; 
    //then fetch any data waiting, and update the widgets that depend on this data
    var now = new Date();
    var flags = [];
            
    var updates = {second:now.getSeconds(), minute:now.getMinutes(), hour:now.getHours(), day:now.getDate(), month:now.getMonth(), once:"once"};
    for(var name in updates)
    {        
        if(updates[name]!=schedule_latches[name])
        {
            flags.push(name);
            schedule_latches[name] = updates[name];
        }
    }  
    // now refresh all of the data sources
    for(var source in data_sources)
    {
        var data = data_sources[source];                
        if(flags.indexOf(data.update)!=-1)
        {                 
            // make sure we don't fail when an update fails
            console.log(source);
            try
            {
                update_datasource(data);            
            }
            catch(err)
            {
                console.log(err);
            }
        }
    }
    
}