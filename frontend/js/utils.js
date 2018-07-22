function deg(rad)
{
    return (rad/Math.PI)*180.0;
}

// from https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
// end

function sph2cart(az, el)
{
    var v1 = [Math.cos(el) * Math.sin(az), -Math.sin(el), Math.cos(el) * Math.cos(az)];            
    return v1;
}

function fit_svg(group, bbox, scaling=1)
{
    // group must not have any scaling applied!
    //group.transform({x:0, y:0, scale:1});
    group.untransform();
    var text_box = group.bbox(draw);
    var target_box = bbox;
    var scale_ratio = scaling*bbox.h/text_box.h;
    group.transform({rotation:0}).transform({x:target_box.x-text_box.x-text_box.w/2+target_box.w/2, 
        y:target_box.y-text_box.y-text_box.h/2+target_box.h/2}).transform({scale:scaling*scale_ratio});  
}


// Wrap HTML in a bounding box, using the foreign element
// functionality
function wrap_to_box(html_text, bbox)
{
    var fobj = draw.foreignObject(bbox.w,bbox.h);
    // add a div to hold the text to be wrapped
    fobj.appendChild("div", {id: 'text_style', style:"color:#fff", innerHTML:html_text});             
    fobj.move(bbox.x, bbox.y);
    return {"container":fobj, "div":fobj.getChild(0)};
}

// Given a MetOffice json forecast, return
// the general weather for today (the
// observation closest to midday)
function general_forecast(json)
{
    return json.SiteRep.DV.Location.Period[0].Rep[0];  
}

// Fetch a URL (via GET), parse as JSON and
// send to the given callback
function request(url, callback)
{
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {                
            callback(JSON.parse(this.responseText));
        }
    };
    request.open('GET', url);
    request.send();
}    

// Fetch a URL (via GET), 
// send to the given callback (as a raw string)
function raw_request(url, callback)
{
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText);
        }
    };
    request.open('GET', url);
    request.send();
}

// Return the datetimes for 00:00 today and tomorrow
function today_tomorrow()
{
    var date = new Date(Date.now());
    // compute the date objects for 00:00 today and tomorrow
    var today_date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var tomorrow = new Date(today_date.valueOf());
    tomorrow.setDate(tomorrow.getDate()+1);                
    return {today:today_date, tomorrow:tomorrow}
}
