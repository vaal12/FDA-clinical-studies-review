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
  
require(["d3", "populate_map"], function(d3, populate_map) {
  // d3 = require('d3');

  d3.select("body").append("h1").text("Successfully loaded D3 version " + d3.version);

  d3.svg("../svg/world-map_for_dashboard.svg",
    function(error, xml) {
      // alert("h1")
      if (error) throw error;
      
      // alert("Hello")
  }).then(function(data) {
  // document.body.appendChild(data.documentElement);
  // alert("I am loaded")
  importedNode = document.importNode(data.documentElement, true);

  // Load external SVG: https://bl.ocks.org/mbostock/1014829
  d3.select("#countries_map").each(
    function() {
        this.appendChild(importedNode.cloneNode(true));
    }
  );

  //Transition of the first DIV:


  d3.select("#left_container").transition().duration(1000)
      .style("transform", "scale(0.01, 1)")
      .on("end",
        function(d) {
          d3.select("#country_details").text("Hello again");
          d3.select("#country_graph").text("Hello again");
        }
      )
      .transition().duration(1000)
      .style("transform", "scale(1, 1)");

  d3.json("../csv/countries_trials_28Oct.json").then(
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
          .domain(nct_counts_arr)
          // .range( d3.schemeBlues[9]);
          .range( d3.schemeYlGnBu[9]);
          
      console.log("Quantiles:")
      console.log(quantile_scale.quantiles())
      populate_map.populateMap("svg2985", data, quantile_scale);
    });//d3.json("../csv/countries_trials_28Oct.json").then(
          // function(data) {

  });//d3.svg("../svg/world-map_for_dashboard.svg",
});//require(["d3"], function(d3) {