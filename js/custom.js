require.config({
  paths: {
    d3: "../js/d3/d3.min",
    populate_map: "../js/populate_map"
  },
});

require(["d3", "populate_map"], function (d3, populate_map) {
  window.d3 = d3
  d3.svg("../svg/world-map_for_dashboard.svg", function (error, xml) {
    if (error) throw error;
  }).then(function (data) {
    // document.body.appendChild(data.documentElement);
    // alert("I am loaded")
    importedNode = document.importNode(data.documentElement, true);

    // Load external SVG: https://bl.ocks.org/mbostock/1014829
    d3.select("#countries_map").each(function () {
        this.appendChild(importedNode.cloneNode(true));
    });//d3.select("#countries_map").each(function () {

    d3.json("../csv/countries_trials_1Nov2018.json").then(
      function (data) {
        console.log("countries_trials_1Nov2018.json")
        console.log(data);
        // console.log("Before")  
        dataAndScale = populate_map.prepareDataAndScale(data);
        // console.log("scales:")
        // console.log(dataAndScale)
        populate_map.populateMap("svg2985", data, dataAndScale.scale);

        populate_map.colorLegend(dataAndScale)

        d3.select("#legend_table").attr("style", "");

        d3.select('#mapModeSelector').on('change', function() {
          console.log("Data:")
          console.log(data)
          console.log(selectValue = d3.select('#mapModeSelector').property('value'))
          dataAndScale = populate_map.prepareDataAndScale(data);
          populate_map.populateMap("svg2985", data, dataAndScale.scale)
          populate_map.colorLegend(dataAndScale)
        });//d3.select('mapModeSelector').on('change', function() {

        
        

        //RECT TO CHECK BOUNDS
        // d3.select("#svg2985").append("rect")
        //   .attr("fill", "red")
        //   .attr("fill-opacity", "0.25")
        //   .attr("x", -50)
        //   .attr("y", 50)
        //   .attr("pointer-events", "all")
        //   .attr("width", 2800)
        //   .attr("height", 1430)
        //   .call(d3.zoom()
        //       .scaleExtent([1, 8])
        //       .on("zoom", zoom)
        // );//d3.select("#svg2985").append("rect")


        //ZOOM BEHAIVIOR
        function zoomFunc() {
          d3.select("#allIncludingForZoomG").attr(
            "transform", d3.event.transform
          )
        }

        svg = d3.select('#svg2985');
        zoomable_layer = d3.select("#allIncludingForZoomG");
        zoom = d3.zoom().scaleExtent([-Infinity, Infinity]).on('zoom', zoomFunc);

        svg.call(zoom)

        // g=d3.select("#allIncludingForZoomG").call(zoom)

        // function zoom() {
        //   // console.log(d3.event.transform)
        //   g.attr("transform", d3.event.transform);
        // }



      });//d3.json("../csv/countries_trials_28Oct.json").then(
    // function(data) {
  });//d3.svg("../svg/world-map_for_dashboard.svg", function(error, xml) {
});//require(["d3", "populate_map"], function(d3, populate_map) {