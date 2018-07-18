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
    