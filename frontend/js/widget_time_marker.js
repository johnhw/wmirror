

// Simple indication of the current time as a line across the time series, linked to the time display
widget_time_marker = {

    init:function(bbox){                
        this.group = draw.group();        
        this.bbox = bbox; 

        // the bounding box of the time widget
        this.time_bbox = get_skeleton_bbox("time");
     
    },  

    update:function(json){                
        this.group.clear();

        var now = Date.now();
        var x = time_xpos(now);
        console.log(x, this.bbox);
        
        this.group.line(x, this.bbox.y, x, this.bbox.y2).stroke({"color":"#fff", "width":2});     
        console.log(this.time_bbox);
        // line to the time widget        
        this.group.line(x, this.bbox.y, this.time_bbox.cx, this.time_bbox.y2).stroke({"color":"#fff", "width":2});     
        
        this.group.rect(20, this.bbox.h).move(-10+x, this.bbox.y).fill({"color":"#fff", "opacity":0.1});     
        
    },  

}

register_widget(widget_time_marker, "today_timeseries", ["time"]);