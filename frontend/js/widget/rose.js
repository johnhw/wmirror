

// Render a cardinal label for the compass
// This extracts the font glyphs (!) and perspective
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
    path = draw.path(path).fill('#fff').attr({'fill-opacity':0.8});  
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

    var style = {"stroke-linecap":"round"};
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
            stroke_polyline = perspective_polyline(coords).style(style);
            group.add(stroke_polyline);
            coords = [];
            drawing = false;
        }
    });
    
    // get the last polyline and put it into the group
    stroke_polyline = perspective_polyline(coords).style(style);
    group.add(stroke_polyline);
    return group;
}



function draw_transits(json)
{
    sun_path = json.sun;
    moon_path = json.moon;

    
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
    compass_group.add(draw_gnomon(json.sun));
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
    var back = draw.circle(font_size).fill("#000").move(vpos[0]-font_size*0.5, vpos[1]-font_size*0.5).fill({"opacity":0.65});

    text = perspective_text(v1, sym, font_size).id("text_style").style({"fill":color});
    
    // semi-transparent triangle to plane, same color as symbol (white above horizon, blue below)
    var compass_v = vec3.create();
    vec3.normalize(compass_v, [v1[0], 0, v1[2]]); // position on compass plane at same angle
    hline = perspective_polyline([[0,0,0], v1, compass_v]).stroke({"color":"#fff", "width":0.005, "dasharray":0.03}).fill(color).attr({'fill-opacity':0.2})
 
    
    group.add(hline);      
    group.add(back);
    group.add(text);
    
    return group;
}

function draw_day(json)
{
    
    function label_day_point(point, horizontal_offset, vertical_offset)
    {
        var date = new Date(point.date);

        var v = sph2cart(point.az, point.alt);            
        var v1 = ftransform(v);
        marker = draw.circle(0.1).move(v1[0]-0.05, v1[1]-0.05).fill("#fff");
        compass_group.add(marker);
        var rbox = marker.rbox(draw);
        
        var l = pad(date.getHours(),2) + "" + pad(date.getMinutes(),2);
        label_group = add_spaced_label(l, [rbox.cx+75*horizontal_offset, rbox.cy+75*vertical_offset], [rbox.cx, rbox.cy], 25, direction='closest');
        label_group.text.id("text_style");
        
    }
    
    label_day_point(json.rising, -1, -1);
    label_day_point(json.setting, 1, 1);
    label_day_point(json.noon, 0.2, -1);
                  
}

var gnomon_scale = 500.0;
// project a ray from a source point through each point
// of the polygon onto the given plane. Return the
// correspodning polygon projected onto this plane.
function project_onto(ray_start, polygon, plane)
{
    var projected = [];    
    polygon.forEach(function(v)
    {
        var v_proj = findLinePlaneIntersectionCoords(ray_start[0], ray_start[1], ray_start[2], v[0], v[1], v[2], plane[0], plane[1], plane[2], plane[3]);
        
        var v_p  = [v_proj.x, v_proj.y, v_proj.z];
        if(vec3.length(v_p)>1/gnomon_scale)
        {
            vec3.scale(v_p, vec3.normalize(v_p, v_p), 1/gnomon_scale);
        }
        projected.push(v_p);
    });
    return projected;
}

function scale_list(list_v3, scale)
{
    var scaled = [];
    list_v3.forEach(function(v)
    {
        scaled.push([v[0]*scale, v[1]*scale, v[2]*scale]);
    });
    console.log(scaled);
    return scaled;

}

function draw_gnomon(sun)
{
    var g = draw.group();
    // we draw a very small gnomon
    // so that the height of the gnomon is negligible
    // compared to the sun; then project and rescale afterwards
    var gnomon_w = 0.0001;
    var gnomon_h = 0.001;
    var w = gnomon_w;
    var h = gnomon_h;

    // separates layers of the gnomon
    var gnomon_marker = draw.rect(0,0);

    function gnomon_slice(angle)
    {
        // draw a shadow, but only if the sun is high enough
        // that we can project sensibly
        var sun_pos = sph2cart(sun.az, sun.alt);    
        if(sun.az<0) return; // sun is below horizon; skip gnomon
        var gnomon_poly = [[-w,0,0], [-w,-h,0], [0,-h*1.25,0], [w,-h,0], [w,0,0]];
        var rotated_poly = [];
        // rotate about axis as needed
        gnomon_poly.forEach(function(v) { v3 = vec3.create(); vec3.rotateY(v3,v,[0,0,0],angle); rotated_poly.push(v3); });
        gnomon_poly = rotated_poly;
        var gnomon = perspective_polygon(scale_list(gnomon_poly,gnomon_scale)).fill({"color":"#fff"});
        gnomon.before(gnomon_marker);
        
        if(-sun_pos[1]>gnomon_h)
        {
            var shadow_poly = project_onto(sun_pos, gnomon_poly, [0,1,0,0]);    
            var gnomon_shadow = perspective_polygon(scale_list(shadow_poly,gnomon_scale)).fill({"color":"#000"});   
            gnomon_shadow.after(gnomon_marker);
            g.add(gnomon_shadow);
        }    

        g.add(gnomon);
    }
    
    gnomon_slice(0);
    gnomon_slice(90);
    gnomon_slice(45);

    if(sun.az>0)
    {
        var rad = gnomon_w*1000.0;
        var pos = ftransform([0,0,0]);
        var c = g.circle(rad).fill("#fff").move(-rad*0.5+pos[0], -rad*0.75+pos[1]);    
    }
            
    return g;    
}


// Create dummy objects which will be used as 
// placeholders to arrange the z-order of objects
// Other objects are placed relative to these, using
// before() and after()
var layer_separators = [
    "base", 
    "transits",
    "locations",
    "analemma",
    "day"]

var rose_layers = {};
function make_layer_separators()
{
    var previous = null;
    layer_separators.forEach(function(name){
        elt = compass_group.rect(0,0);
        if(previous) { elt.after(previous); }
        previous = elt;
        rose_layers[name] = elt;
    });
}

function init_rose(bbox)
{
    

    opentype.load(font_file, function(err, font) {
        if (err) {
            alert('Could not load font: ' + err);
        } else {
        global_font = font;    
        
    
        compass_group = draw.group();     
        make_layer_separators();
        
        compass(compass_group);        
        fit_svg(compass_group, bbox, 0.8);
      
        // get each of the sub-components
        request("/astro/solar_day", json=>{draw_day(json)});  
        request("/astro/transits", json=>{draw_transits(json)});
        // hmm: these need to be updated a different rate...
        
        request("/astro/locations", json=>{draw_locations(json)}); 
        request("/astro/analemma", json=>{draw_analemma(json)});
        }
    });
}

widget_rose = {
    init:init_rose,
    update:function(){},    
}

register_widget(widget_rose, "gnomon", [])