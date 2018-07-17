

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
        return ftransform([(rotated[0]-w/2)*scale+x, 0, (rotated[1]+h/2)*scale+y]);});    
    path = draw.path(path).fill('#fff');  
    return path;
    //return perspective_text([x,0,y], label, sz);    
}

function compass(attrs)
    {        
        attrs = attrs || {};
        var rose = draw.group();
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
        rose.add(perspective_circle(scale).stroke({"color":"#000", "width":0.01}).fill({"color":"#fff"})).attr('fill-opacity',0.2);

        
        var scale = mat4.create();
        mat4.scale(scale, scale, [min_rad, min_rad, min_rad]);
        rose.add(perspective_circle(scale).stroke({"color":"#fff", "width":0.01}).fill({"color":"#fff"})).attr('fill-opacity',0.2);

        
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
opentype.load('https://raw.githubusercontent.com/nodebox/opentype.js/master/fonts/Roboto-Black.ttf', function(err, font) {
    if (err) {
        alert('Could not load font: ' + err);
    } else {
    global_font = font;    
    var compass_group = compass();
    var compass_rose = compass_group.scale(200.0,200.0).translate(500,900);
    }
});
