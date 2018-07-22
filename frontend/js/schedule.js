
// sources of data, fetched with request
// json passed to the update function when updates happen
// update always happens at launch, then on the schedule
// given. updates always happen at most 1 second past the 
// turnover for that period (e.g. daily between 00:00:00 and 00:00:01)
data_sources = {
    'forecast' : {
        url:'/metoffice/forecast',
        update:'hour',
    },
    'wifi' :
    {
        url:'/wifi',
        update:'second',
    },
    'tides':
    {
        url:'/tides',
        update:'day',
    },
    'solar_image' :
    {
        url:'/image/solar_image.jpg',
        update:'day',
    },    
    'aurora_image' :
    {
        url:'/image/aurora_prediction.jpg',
        update:'day',
    },
    'time' : {
        url:'/time',
        update:'minute',
    },
    'location' : {
        url:'/location',
        update:'day',
    },
    'date' : {
        url:'/date',
        update:'day',
    },
    'inshore_forecast' : 
    {
        url:'/metoffice/inshore_forecast',
        update:'hour',
    },
    'shipping_forecast' : 
    {
        url:'/metoffice/shipping_forecast',
        update:'hour',
    },
    'lunar_phase':
    {
        url:'/astro/lunar_phase',
        update:'day',
    },    
    'locations' : 
    {
        url:'/astro/locations',
        update:'minute',
    },
    'version':
    {
        url:'/version',
        update:'hour',
    },
    'transits' : 
    {
        url:'/astro/transits',
        update:'day',        
    },
    'events':
    {
        url:'/events',
        update:"hour",
    },
    'solar_day' : 
    {
        url:'/astro/solar_day',
        update:'day',        
    },
    'analemma' : 
    {
        url:'/astro/analemma',
        update:'minute',        
    },
    'keepalive' : 
    {
        url:'keepalive',
        update:'second',        
    }  
}

// create blank arrays for the dependencies
for(var k in data_sources)
{
    data_sources[k].deps = [];
}

// initially, nothing has been latched; will be updated
// in schedule_fetch
var schedule_latches = {}

function handle_data_deps(data)
{
    //update required, find dependent widgets
    if(data.deps)
    {                    
        data.deps.forEach(function(dep)
        {                        
            var update_widget = widgets[dep];                    
            if(update_widget)
            {                        
                // pass the JSON for this update to the widget that depends on it
                try
                {
                    update_widget.update(data.json || null);
                }
                catch(err)
                {
                    console.log(err);
                }
            }
        });
    }
}

function update_datasource(data)
{
    if(data.url)
    {
        // fetch data (even if no deps)
        request(data.url, function(json)
            {             
                data.json = json; // cache data                  
                handle_data_deps(data);    
            });
    }
    else
    {
        // no URL, just call the function
        data.json = {};
        handle_data_deps(data);
    }

}

function schedule_fetch()
{
    //Check the time; see what flags need updating; 
    //then fetch any data waiting, and update the widgets that depend on this data
    var now = new Date();
    var flags = [];
            
    // valid update rates for data sources
    var updates = {second:now.getSeconds(),
         minute:now.getMinutes(), 
         hour:now.getHours(), 
         day:now.getDate(), 
         month:now.getMonth(), 
         once:"once"};

    // check if the relevant state is newer than the one
    // last recorded (always true on startup)
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