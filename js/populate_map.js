
require.config({
    paths: {
        d3: "../js/d3/d3.min",
    //   plotly : "https://cdn.plot.ly/plotly-latest.min"
        plotly : "../js/plotly/plotly-latest.min",
        c3: "../js/c3.min"
    }
  });


function mapClicked(d3Obj, plotlyObj, elementClicked) {

    d3.select("#left_container").transition().duration(1000)
      .style("transform", "scale(0.001, 1)")
      .on("end",
        function(d) {
          d3.select("#country_details").text("Hello again");
          d3.select("#country_graph").text("");
          var chart = c3.generate({
            bindto: '#country_graph',
            size: {
                height: 140,
                width: 280
            },
            data: {
                columns: [
                    [d3.select(elementClicked).attr("id"), 30, 200, 100, 400, 150, 250]
                ]
            }
        });
        }
      )
      .transition().duration(1000)
      .style("transform", "scale(1, 1)");

    
    // console.log("mouse click:"+d3Obj.select(elementClicked).attr("id"))

    // var data = [{
    //     x: ['giraffes', 'orangutans', 'monkeys'],
    //     y: [20, 14, 23],
    //     type: 'bar'
    // }];

    // var layout = {
    //     title: 'Hide the Modebar',
    //     showlegend: true,
    //     autosize: false,
    //     width: 340,
    //     height: 220,
    //     margin: {
    //         l: 30,
    //         r: 30,
    //         b: 30,
    //         t: 30,
    //         pad: 4
    //     },
    //     // paper_bgcolor: '#7f7f7f',
    //     // plot_bgcolor: '#c7c7c7'
    // };
      
    // plotlyObj.newPlot('country_graph', data,  layout, {displayModeBar: false});
}//END function mapClicked(d3Obj, plotlyObj, elementClicked) {


define(["c3", "plotly"], function(c3, Plotly){ return {
        populateMap: function(svg_map_elem_id, data, quantile_scale) {
            window.c3 = c3;
            // console.log("Hello"+svg_map_elem_id);
            svg_elem = d3.select("#countries_map");
            // console.log(svg_elem);
            svg_elem.selectAll("g").each(function(d) {
                this_tag_id = d3.select(this).attr("id") 
                // console.log(d3.select(this).attr("id"))
                // console.log(data[this_tag_id])
                if(typeof data[this_tag_id] === 'undefined') {
                    // console.log("No data");
                }//END  if(typeof data[this_tag_id] === 'undefined') {
                else {// if(typeof data[this_tag_id] === 'undefined') {
                    // console.log("   Data:")
                    // console.log(data[this_tag_id].nct_id_count)
                    // console.log(data[this_tag_id].full_country_name)
                    // console.log(quantile_scale(
                    //     data[this_tag_id].nct_id_count
                    // ));
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
                }//END else {// if(typeof data[this_tag_id] === 'undefined') {
            });//END svg_elem.selectAll("g").each(function(d) {
            
            //Removing extra circles, which do not have data available for them on the map
            svg_elem.selectAll(".circlexx").remove();

            svg_elem.selectAll("g").each(
                function() {
                    d3.select(this).on("click", function() {
                            mapClicked(d3, Plotly, this)
                        }
                    );
            })//END svg_elem.selectAll("g").each(
        }//populateMap: function(svg_map_elem_id, data, quantile_scale) {
} });//END define(["d3"], function(d3){ return {