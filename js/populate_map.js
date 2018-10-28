
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
                this_tag_id = d3.select(this).attr("id") 
                console.log(d3.select(this).attr("id"))
                // console.log(data[this_tag_id])
                if(typeof data[this_tag_id] === 'undefined') {
                    console.log("No data");
                    
                }
                else {
                    console.log("   Data:")
                    console.log(data[this_tag_id].nct_id_count)
                    console.log(data[this_tag_id].full_country_name)

                }
                
            }
        );
        console.log(data)
      }
    }
  });

// requirejs(["d3"],
    

// )//requirejs