

// convert a font path (for HTML canvas drawing)
// to an SVG path string, apply (optionally) the
// given transform function f([x,y]) => [x,y] to each
// positional element 
function svg_path(font_path, transform)
{
  var svg_string = "";
  transform = transform || function(v) { return v; };

  font_path.commands.forEach(function(path_elt)
  {
    svg_string += path_elt.type;    
    if(path_elt.x1) 
    { 
      var p1 = transform([path_elt.x1, path_elt.y1]);
      var p = transform([path_elt.x, path_elt.y]);
      svg_string += " "+p1[0]+" "+p1[1]+", "+p[0]+" "+p[1];
    }
    else if(path_elt.x)
    {       
      var p = transform([path_elt.x, path_elt.y]);
      svg_string += " "+p[0]+" "+p[1];
    }
    svg_string += " ";    
  });
  return svg_string;

}

function polyline(pts)
{
  var path="";
  pts.forEach(function(pt) {
    path += pt[0] + " " + pt[1] + " ";
  });  
  return path;
}

function distance(p1, p2)
{
  d =  Math.sqrt((p1[0]-p2[0])*(p1[0]-p2[0]) + (p1[1]-p2[1])*(p1[1]-p2[1])); 
  return d;
}

function set_attr(svgobj, attrs)
{  
  for(var k in attrs)
  { 
    svgobj.attr(k, attrs[k]);
  }
  return svgobj;
}

// text *centered* on a specific point
function text_at(text, pos, w)
{
  var text = draw.text(text);
  text.font({'font-size':200});  
  // center text
  var bbox = text.rbox();
  
  text.move(pos[0]-bbox.w/2,pos[1]-bbox.h/2);
  text.scale(0.005*w, 0.005*w);
  return text;
}

function label(text, pos, to,  font, direction="top", text_style={"fill":"#fff"}, spur_len=25, space_len=10)
{
  var group = draw.group();
  
  var text = text_at(text, pos, font);
  set_attr(text, text_style);
  // center text
  var bbox = text.rbox();
  // debug for finding bounding box of rectangle
  box = draw.rect(bbox.w, bbox.h).fill('none').stroke('none').move(bbox.x, bbox.y);
  
  var label_dir = {
    "top":function(){return [bbox.x+bbox.w/2, bbox.y, 0, -1];},
    "bottom":function(){return [bbox.x+bbox.w/2, bbox.y+bbox.h, 0, 1];},
    "left":function(){return [bbox.x, bbox.y+bbox.h/2,-1,0];},
    "right":function(){return [bbox.x+bbox.w, bbox.y+bbox.h/2,1,0];},    
  };
  
  // find neatest direction to target
  if(direction==="closest")
  {
    var min_distance;
    var label_side = "top";

    min_distance = distance(label_dir["top"](), to);
    if(distance(label_dir["left"](), to)<min_distance)
    {
      label_side = "left"; min_distance=distance(label_dir["left"](), to);
    }
    if(distance(label_dir["right"](), to)<min_distance)
    {
      label_side = "right"; min_distance=distance(label_dir["right"](), to);
    }
    if(distance(label_dir["bottom"](), to)<min_distance)
    {
      label_side = "bottom"; min_distance=distance(label_dir["bottom"](), to);
    }
    direction = label_side;    
  }

  
  var label_start = label_dir[direction]();
  // space from bbox edge to start of label, in direction
  // that spur is heading ("outwards")
  var line_start = [label_start[0]+space_len*label_start[2], 
  label_start[1]+space_len*label_start[3]];
  
  // spur: short line heading out from bbox in straight vertical/horizontal
  // direction
  var spur = [line_start[0]+label_start[2] * spur_len, 
  line_start[1]+label_start[3] * spur_len];
  
  // split into 45 degree section and v/h section
  var xchange =  spur[0] - to[0];
  var ychange =  spur[1] - to[1];

  var min_change = Math.min(Math.abs(xchange), Math.abs(ychange));
  var x45 = spur[0] - min_change * Math.sign(xchange);
  var y45 = spur[1] - min_change * Math.sign(ychange);
  
  // remaining part must be either vertical or horizontal by definition
  var path = [line_start, spur, [x45, y45], to];
  var line = draw.polyline(polyline(path)).stroke('#fff').fill('none');

  group.add(box);
  group.add(line);
  group.add(text);
  return {group:group, line:line, text:text, box:box};
}
