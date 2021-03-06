// 3D projection for solar/lunar paths
    var modelview_matrix = mat4.create();
    var projection_matrix = mat4.create();
    // only 2D part used
    var viewport_matrix = [5,0,0,0,
                           0,5,0,0,
                           0,0,1,0,
                           0,0,0,1];
    
    mat4.perspective(projection_matrix, 0.5, 1.0, 1, 50);    
    mat4.lookAt(modelview_matrix, [-10,-10,10], [0,0,0], [0,1,0]);
    mat4.scale(modelview_matrix, modelview_matrix, [1,1,1]);
    mat4.scale(projection_matrix, projection_matrix, [-1,1,1]);


    
    

    function perspective_divide(v4)
    {        
        for(var i=0;i<4;i++)
        {
            v4[i] = v4[i] / v4[3];
        }     
    }

    function ftransform(v3)
    {
        var t = vec4.create();
        vec3.transformMat4(t, v3, modelview_matrix);
        vec4.transformMat4(t, t, projection_matrix);
        perspective_divide(t);        
        vec4.transformMat4(t, t, viewport_matrix);
        return [t[0], t[1]];        
    }

    
    function inv_ftransform(v2, z)
    {
        // the inverse matrices
        var inv_viewport_matrix = mat4.create(); mat4.invert(inv_viewport_matrix, viewport_matrix);

        var mvp = mat4.create(); mat4.multiply(mvp, projection_matrix, modelview_matrix);
        var inv_mvp = mat4.create(); mat4.invert(inv_mvp, mvp);
        
        var inv_projection_matrix = mat4.create(); mat4.invert(inv_projection_matrix, projection_matrix);
        var inv_modelview_matrix = mat4.create(); mat4.invert(inv_modelview_matrix, modelview_matrix);

    
        var t = vec4.create();
        vec4.transformMat4(t, [v2[0], v2[1], z, 1.0], inv_viewport_matrix); // to screen coordinates
        
        
        vec4.transformMat4(t, t, inv_mvp);
        console.log("inv proj", t);
        //vec4.transformMat4(t, t, inv_modelview_matrix);
        //console.log("inv modelview", t);
        // inverse divide
        t[3] = 1.0/t[3];
        t[0] *= t[3];
        t[1] *= t[3];
        t[2] *= t[3];
        
        console.log(t);
        return [t[0], t[1], t[2]];
    }
    
    

    function perspective_circle(mat4, start_angle, end_angle)
    {
        if (typeof start_angle === 'undefined') { start_angle = 0; }
        if (typeof end_angle === 'undefined') { end_angle = 2*Math.PI; }
        var i, n;
        n = 64; // segments
        var path_str = "";
        v4 = vec4.create();
        for(i=0;i<n;i++)
        {
            var angle = (i/(n-1)) * (end_angle-start_angle) + start_angle;
            var cx = Math.cos(angle);
            var cy = -Math.sin(angle);
            vec4.transformMat4(v4, [cx,0,cy,1], mat4);
            var projected = ftransform([v4[0],v4[1],v4[2]]);
            path_str += projected[0] + "," + projected[1] + " ";
        }        
        return draw.polygon(path_str);
    }


    function perspective_size(v1, w)
    {
        var vw = ftransform([v1[0]+w, v1[1]+w, v1[2]+w]);
        var v = ftransform(v1);
        var w = (Math.abs(v[0]-vw[0]) + Math.abs(v[1]-vw[1])) / 2 ;
        return w;
    }

        
    function perspective_line(v1, v2, w)
    {
        
        w = perspective_size(v1, w);
        v1 = ftransform(v1);
        v2 = ftransform(v2);                
        return draw.line(v1[0], v1[1], v2[0], v2[1]).style({"stroke-width":w});
    }

    function perspective_polyline(pts)
    {
        v4 = vec4.create();
        path_str = ""
        pts.forEach(function(v){
            var projected = ftransform([v[0],v[1],v[2]]);
            path_str += projected[0] + "," + projected[1] + " ";
        });
        return draw.polyline(path_str);        
    }

    function perspective_polygon(pts)
    {
        v4 = vec4.create();
        path_str = ""
        pts.forEach(function(v){
            var projected = ftransform([v[0],v[1],v[2]]);
            path_str += projected[0] + "," + projected[1] + " ";
        });
        return draw.polygon(path_str);        
    }


    function perspective_text(v1, text, size)
    {
        var v = ftransform(v1);
        var w = perspective_size(v1, size);                        
        
        var text_obj = text_at(text, v, w);
        
        return text_obj;        
    }