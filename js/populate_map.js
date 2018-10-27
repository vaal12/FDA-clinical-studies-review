
require.config({
    paths: {
      d3: "../js/d3/d3.min",
      populate_map: "../js/populate_map"
    }
  });


// import * as d3 from 'd3';
define(["d3"], function(d3){
    return {
      name: 'David',
      populateMap: function(svg_map_elem_id, data) {
        console.log("Hello"+svg_map_elem_id);
        svg_elem = d3.select("#countries_map");
        console.log(svg_elem);
        svg_elem.selectAll("g").each(
            function(d) {
                // console.log("this:"+this);
                console.log(d3.select(this).attr("id"))
            }
        );
        console.log(data)
      }
    }
  });

// requirejs(["d3"],
    

// )//requirejs