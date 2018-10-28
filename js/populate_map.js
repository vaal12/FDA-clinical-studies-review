
require.config({
    paths: {
      d3: "../js/d3/d3.min",
    //   populate_map: "../js/populate_map"
    }
  });


define(["d3"], function(d3){
    return {
    //   name: 'David',
      populateMap: function(svg_map_elem_id, data, quantile_scale) {
        // console.log("Hello"+svg_map_elem_id);
        svg_elem = d3.select("#countries_map");
        // console.log(svg_elem);
        svg_elem.selectAll("g").each(
            function(d) {
                this_tag_id = d3.select(this).attr("id") 
                // console.log(d3.select(this).attr("id"))
                // console.log(data[this_tag_id])
                if(typeof data[this_tag_id] === 'undefined') {
                    // console.log("No data");
                }
                else {
                    console.log("   Data:")
                    console.log(data[this_tag_id].nct_id_count)
                    console.log(data[this_tag_id].full_country_name)
                    console.log(quantile_scale(
                        data[this_tag_id].nct_id_count
                    ));
                    d3.select(this).selectAll("path, circle").each(
                        function() {
                            d3.select(this).attr(
                                "fill", 
                                quantile_scale(data[this_tag_id].nct_id_count)
                            )
                            .attr("stroke",
                                quantile_scale(data[this_tag_id].nct_id_count)
                            )
                            .classed('circlexx', false);
                        }
                    );//d3.select(this).selectAll("path").each(
                    d3.select(this).select("title").text(
                        data[this_tag_id].full_country_name+":  "+
                        data[this_tag_id].nct_id_count
                    )
                }//else {
            }//svg_elem.selectAll("g").each(

        
                // function(d) {    
        );//svg_elem.selectAll("g").each(
        svg_elem.selectAll(".circlexx").remove();
        // console.log(data)
      }//populateMap: function(svg_map_elem_id, data, quantile_scale) {
    }//return {
  });//define(["d3"], function(d3){