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

  
function fit_svg(svg_group, bbox, scaling=1)
{
    var existing_bbox = svg_group.rbox(draw);
    svg_group.move(bbox.x-existing_bbox.w/2+bbox.w/2, bbox.y-existing_bbox.h/2+bbox.h/2);
    var scale_ratio = scaling*bbox.h/existing_bbox.h;    
    svg_group.scale(scale_ratio, scale_ratio);
}
