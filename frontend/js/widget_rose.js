

// Render a cardinal label for the compass
// This extracts the font glyps (!) and perspective
// projects the corresponding polygons, so that they line up
// nicely
 
function cardinal(label, rad, angle, sz)
{
    var x = Math.sin(angle)*rad;
    var y = Math.cos(angle)*rad;
    
    font_path = global_font.getPath(label);    
    
    var bbox = font_path.getBoundingBox();
    var w = bbox.x2 - bbox.x1;
    var h = bbox.y2 - bbox.y1;

    var scale = sz/72.0; // compensate for glyph scale of 72  
    var rotated = vec2.create();
    path = svg_path(font_path, function(p){
        vec2.rotate(rotated, p, [w/2,-h/2], angle);
        return ftransform([(rotated[0]-w/2)*-scale+x, 0, (rotated[1]+h/2)*scale+y]);});    
    path = draw.path(path).fill('#fff').attr({'fill-opacity':0.2});  
    return path;    
}

function compass(group, attrs)
    {        
        attrs = attrs || {};
        var rose = group;
        var i;
        var inner_rad = attrs.inner_rad || 0.9;
        var min_rad = attrs.outer_rad || 1.0;
        
        var n = attrs.n_ticks || 72;
        var width = attrs.linewidth || 0.002;
        
        // outer compass
        for(i=0;i<n;i++)
        {
            var step = i/n;
            var angle = (step) * 2 * Math.PI;
            var cx = Math.cos(angle);
            var cy = -Math.sin(angle);
            
            var irad = inner_rad;
            var rad = min_rad;
            var w = width;
            if(step*4==Math.floor(step*4))
            {
                irad *= 0.8;
                rad = min_rad * 1.0;
                w *= 1.5;
            }
            if(step*8==Math.floor(step*8))
            {
                irad *= 0.8;
                rad = min_rad * 1;
                w *= 2;
            }            
            if(i%2==0)
            {
                w *= 2;
            }            
            
            var inner_x = cx * irad;
            var inner_y = cy * irad;
            var min_outer_x = cx * rad;
            var min_outer_y = cy * rad;   

            rose.add(perspective_line([inner_x, 0, inner_y], [min_outer_x, 0, min_outer_y], w).style({"stroke":"#fff"}));
        }

        // Outer circles and hemisphere

        text_rad = 1.4;
        var scale = mat4.create();
        mat4.scale(scale, scale, [text_rad, text_rad, text_rad]);
        rose.add(perspective_circle(scale).stroke({"color":"#fff", "width":0.001}).fill({"color":"#fff"}).attr('fill-opacity',0.0));

        
        var scale = mat4.create();
        mat4.scale(scale, scale, [min_rad, min_rad, min_rad]);
        rose.add(perspective_circle(scale).stroke({"color":"#fff", "width":0.01}).fill({"color":"#fff"}).attr('fill-opacity',0.1));

        
        mat4.rotate(scale, scale, Math.PI/2, [1,0,0]);        
        rose.add(perspective_circle(scale, Math.PI, Math.PI*2).stroke({"color":"#fff", "width":0.0025, "dasharray":"0.02"}).fill({"color":"#fff"}).attr('fill-opacity',0.0));


        for(var i=0;i<4;i++)
        {
            mat4.rotate(scale, scale, Math.PI/4, [0,0,1]);        
            rose.add(perspective_circle(scale, Math.PI, Math.PI*2).stroke({"color":"#fff", "width":0.0025, "dasharray":"0.02"}).fill({"color":"#fff"}).attr('fill-opacity',0.0));
        }

        // Inner circle
        mat4.identity(scale);
        mat4.scale(scale, scale, [inner_rad, inner_rad, inner_rad]);

        // Vertical line
        rose.add(perspective_line([0,0,0], [0,-min_rad,0], w).style({"stroke":"#fff", "stroke-dasharray":"0.01"}));       
        
        cardinals = {N:0, E:Math.PI/2, S:Math.PI, W:3*Math.PI/2}
        var radius = 1.2;
        for(var c in cardinals)
            rose.add(cardinal(c, radius, cardinals[c], 0.28));

        subcardinals = {NE:0+Math.PI/4, SE:Math.PI/2+Math.PI/4, SW:Math.PI+Math.PI/4, NW:3*Math.PI/2+Math.PI/4}
        for(var c in subcardinals)
            rose.add(cardinal(c, radius, subcardinals[c], 0.2));
       
        
        return rose;
    }


    

var global_font;
var compass_group;

var font_file = '/fonts/geosanslight/geosanslight-webfont.ttf';


function draw_spherical_path(path, upper_side)
{
    var group = draw.group();
    var coords = [];
    // because path is split according to the side
    // of the horizon, a group must be returned,
    // with a collection of polyline segments
    var drawing = true;
    path.forEach(function(entry) {
        
        var az = entry.az;
        var el =  entry.alt;
        var v1 = sph2cart(az,el);
        // spherical to cartesian            
        if(v1[1]*upper_side<=0)            
        {                   
            coords.push(v1);
            drawing = true;                            
        }        
        else if(drawing)
        {
            //  detect breaks and split the polyline
            stroke_polyline = perspective_polyline(coords);
            group.add(stroke_polyline);
            coords = [];
            drawing = false;
        }
    });
    
    // get the last polyline and put it into the group
    stroke_polyline = perspective_polyline(coords);
    group.add(stroke_polyline);
    return group;
}



function draw_transits(json)
{
    sun_path = json.sun;
    moon_path = json.moon;

    // draw the rose and various guides
    console.log(sun_path);
    
    var day_moon_polyline = draw_spherical_path(moon_path, 1);        
    var day_sun_polyline = draw_spherical_path(sun_path, 1);

    var night_sun_polyline = draw_spherical_path(sun_path, -1); // -1 to show night side (below horizon)
    var night_moon_polyline = draw_spherical_path(moon_path, -1);
    
    compass_group.add(day_sun_polyline.stroke({"color":"#fff", "width":0.05}).fill({"color":"none"}));
    compass_group.add(night_sun_polyline.stroke({"color":"#337", "width":0.01}).fill({"color":"none"}));

    compass_group.add(day_moon_polyline.stroke({"color":"#ff8", "width":0.01, "dasharray":0.03}).fill({"color":"none"}));
    compass_group.add(night_moon_polyline.stroke({"color":"#117", "width":0.01, "dasharray":0.03}).fill({"color":"none"}));                        

    
}


// current location of sun/moon
function draw_locations(json)
{
    
    var sun_pos = json.sun;
    sun_symbol = draw_symbol(json.sun, '☉', 0.2, Math.floor(deg(json.sun.alt))+"°", 0.1);
    moon_symbol = draw_symbol(json.moon, '☽', 0.15, Math.floor(deg(json.moon.alt))+"°", 0.1);
    
    
    compass_group.add(sun_symbol);        
    compass_group.add(moon_symbol);                
}

function draw_analemma(json)
{
    sun_analemma = json.sun;                
    var analemma_polyline = draw_spherical_path(sun_analemma, 1); 
    compass_group.add(analemma_polyline.stroke({"color":"#ff2", "width":0.01}).fill({"color":"none"}));                
    var analemma_polyline = draw_spherical_path(sun_analemma, -1); 
    compass_group.add(analemma_polyline.stroke({"color":"#44b", "width":0.01}).fill({"color":"none"}));                
}

function draw_symbol(obj, sym, font_size)
{
    var group = draw.group();
    var v1 = sph2cart(obj.az, obj.alt);        
    var vpos = ftransform(v1);
    var color = '#fff';
    console.log(sym,v1,obj);
    if(obj.alt<0)
    {
     color = '#44d';   
    }
    var back = draw.circle(font_size*0.9).fill("#000").move(vpos[0]-font_size*0.4, vpos[1]-font_size*0.3);

    text = perspective_text(v1, sym, font_size).id("text_style").style({"fill":color});
    
    hline = perspective_polyline([[0,0,0], v1, [v1[0], 0, v1[2]]]).stroke({"color":"#fff", "width":0.005, "dasharray":0.03}).fill('#fff').attr({'fill-opacity':0.2})
 
    
    group.add(hline);      
    group.add(text);

    return group;
}

function draw_day(json)
{
    console.log(json);
    
    function label_day_point(point, horizontal_offset, vertical_offset)
    {
        var date = new Date(point.date);

        var v = sph2cart(point.az, point.alt);            
        var v1 = ftransform(v);
        marker = draw.circle(0).move(v1[0], v1[1]).fill("#f0f");
        compass_group.add(marker);
        var rbox = marker.rbox(draw);
        
        var l = pad(date.getHours(),2) + "" + pad(date.getMinutes(),2);
        label_group = label(l, [rbox.cx+75*horizontal_offset, rbox.cy+75*vertical_offset], [rbox.cx, rbox.cy], 25, direction='closest');
        label_group.text.id("text_style");
        
    }
    
    label_day_point(json.rising, -1, -1);
    label_day_point(json.setting, 1, 1);
    label_day_point(json.noon, 0.2, -1);
                  
}

function init_rose(bbox)
{
    opentype.load(font_file, function(err, font) {
        if (err) {
            alert('Could not load font: ' + err);
        } else {
        global_font = font;    
        compass_group = draw.group();        
        compass(compass_group);        
        fit_svg(compass_group, bbox, 0.75);
        // get each of the sub-components
        request("/astro/solar_day", json=>{draw_day(json)});  
        request("/astro/transits", json=>{draw_transits(json)});
        // hmm: these need to be updated a different rate...
        request("/astro/analemma", json=>{draw_analemma(json)});
        request("/astro/locations", json=>{draw_locations(json)}); 
        }
    });
}

widget_rose = {
    init:init_rose,
    update:function(){},    
}

register_widget(widget_rose, "gnomon", [])