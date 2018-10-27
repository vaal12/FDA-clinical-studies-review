require.config({
    paths: {
      d3: "../js/d3/d3.min",
      // d3_dsv: "../js/d3/d3-dsv.v1.min",
      // d3_fetch: "../js/d3/d3-fetch.v1.min"
    }
  });
  
  require(["d3"], function(d3) {
    d3.select("body").append("h1").text("Successfully loaded D3 version " + d3.version);

    d3.svg("../svg/world-map.svg",
      function(error, xml) {
        alert("h1")
        if (error) throw error;
        
        alert("Hello")
    }).then(function(data) {
      // document.body.appendChild(data.documentElement);
      alert("I am loaded")
      importedNode = document.importNode(data.documentElement, true);

      // Load external SVG: https://bl.ocks.org/mbostock/1014829
      d3.select("#countries_map").each(
        function() {
           this.appendChild(importedNode.cloneNode(true));
        }
      );
      // d3.select("#countries_map").text("qwe3");
      // console.log(data.documentElement)
    });
    
    // alert("h2")
  });