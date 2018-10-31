require.config({
    paths: {
      d3: "../js/d3/d3.min",
      populate_map: "../js/populate_map"
    },
    // shim: {
    //   'd3': {
    //       exports: 'd3',
    //       init: function() {
    //           window.d3 = d3;
    //       }
    //   },
    // }
  });

  var d3 = null;
  
  function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

require(["d3", "populate_map"], function(d3, populate_map) {
  window.d3 = d3
  d3.svg("../svg/world-map_for_dashboard.svg",
    function(error, xml) {
      if (error) throw error;
  }).then(function(data) {
    // document.body.appendChild(data.documentElement);
    // alert("I am loaded")
    importedNode = document.importNode(data.documentElement, true);

    // Load external SVG: https://bl.ocks.org/mbostock/1014829
    d3.select("#countries_map").each(
      function() {
          this.appendChild(importedNode.cloneNode(true));
    });//


    

  d3.json("../csv/countries_trials_31Oct2018.json").then(
    function(data) {
      console.log(data);
      var nct_counts_arr = []
      for(var cnt in data) {
        // console.log(cnt)
        nct_counts_arr.push(data[cnt].nct_id_count)
      }
      nct_counts_arr.sort(function(a, b){return a - b});
      // console.log("nct_counts_arr")
      // console.log(nct_counts_arr);

      //Chromatic scales: https://github.com/d3/d3-scale-chromatic
      var quantile_scale = d3.scaleQuantile()
      // var quantile_scale = d3.scaleThreshold()
      // var quantile_scale = d3.scaleQuantize()
          .domain(nct_counts_arr)
          // .range( d3.schemeBlues[9]);
          .range( d3.schemeYlGnBu[9]);
          
      console.log("Quantiles:")
      console.log(quantile_scale.quantiles())
      populate_map.populateMap("svg2985", data, quantile_scale);

      
      good_quantiles = [0];
      var i=0;
      while(i<quantile_scale.quantiles().length) {
        console.log(quantile_scale.quantiles()[i]);
        good_quantiles.push(quantile_scale.quantiles()[i]);
        i++;
      }

      good_quantiles.push(d3.max(nct_counts_arr));

      console.log("Good quantiles:"+good_quantiles);

      i=0;
      while(i<(good_quantiles.length-1)) {
        curr_color = quantile_scale(good_quantiles[i]);
        legend_text = ""+Math.floor(good_quantiles[i])+"-"+
                  (Math.floor(good_quantiles[i+1])-1);
        
        // curr_color = quantile_scale(quantile_scale.quantiles()[i-1]);
        //     legend_text = ""+quantile_scale.quantiles()[i-1]+"-"+quantile_scale.quantiles()[i];
        // }
        // console.log("processing quantile:"+quantile_scale.quantiles()[i]);
        console.log("color:"+curr_color);
        console.log("Inverted:"+invertColor(curr_color))
        d3.select("#legend"+(i+1))
          .attr("style", "background-color:"+curr_color+"; color:"+invertColor(curr_color))
          .text(legend_text);
        i++;
      }




    });//d3.json("../csv/countries_trials_28Oct.json").then(
          // function(data) {

  });//d3.svg("../svg/world-map_for_dashboard.svg",
});//require(["d3"], function(d3) {