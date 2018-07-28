// Given a MetOffice json forecast, return
// the general weather for today (the
// observation closest to midday) for the given day
// 0=today, 1=tomorrow, etc.
function general_forecast(json, day=0)
{
    return json.SiteRep.DV.Location.Period[day].Rep[0];  
}

// given a forecast and observation data, return the forecast
// data closest to the given datetime

// return a weather and observation array in a sensible format
function weather_array(forecast_observation, date)
{
    var concatenated_forecast = [];    
    var forecast_periods = forecast_observation.forecast.SiteRep.DV.Location.Period;
    var observation_periods = forecast_observation.observation.SiteRep.DV.Location.Period;
    var combined_periods = observation_periods.concat(forecast_periods);
    var reps = [];
    var last_date = null;    
    combined_periods.forEach(function (period)    
    {
        var ymd = period.value.slice(0, -1).split("-");    
        // Note: times are zulu (i.e. UTC, not local time)
        // and crazy one month offset for zero-based javascript months :)
        var date = new Date(Date.UTC(ymd[0], ymd[1]-1, ymd[2], 0, 0, 0, 0));     
               
        period.Rep.forEach(function (rep)
        {
            var offset_minutes = rep["$"];            
            var rep_date = new Date(date.getTime()+MS_PER_MINUTE*offset_minutes);                        
            rep.date = rep_date;
            if(last_date===null || rep_date.getTime()>last_date.getTime())
            {
                reps.push(rep);                
                last_date = rep_date;
            }
        });
    });
    return reps;
}

// Extract a time series of dates and one particular value (e.g. temperature is "T")
function get_weather_time(weather_a, selector)
{
    var times = [];
    var ys = [];
    weather_a.forEach(function(elt)
    {
        times.push(elt.date);
        ys.push(parseFloat(elt[selector]));
    });
    return [times, ys];
}


// Extract a time series of dates and one particular string value (e.g. direction is "D", can be "N","NE", etc.)
function get_weather_string(weather_a, selector)
{
    var times = [];
    var ys = [];
    weather_a.forEach(function(elt)
    {
        times.push(elt.date);
        ys.push(elt[selector]);
    });
    return [times, ys];
}

// Return the weather report closest to the given time
// mode can be: both, forecast or observation to select only those fields
function summary_weather(weather_a, date, mode='both')
{
    var min_diff = 1e16;
    var weather;
    for(var i=0;i<weather_a.length;i++)
    {
        var is_observation = (weather_a[i].Dp);
        if(mode=='both' || (mode=='observation' && is_observation) || (mode=='forecast' && !is_observation))
        {
            var diff = Math.abs(date-weather_a[i].date);            
            if(diff<min_diff) {min_diff = diff; weather = weather_a[i]; }
        }
    }
    return weather;
}