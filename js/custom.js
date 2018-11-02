require.config({
  paths: {
    d3: "../js/d3/d3.min",
    populate_map: "../js/populate_map"
  },
});

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
        console.log("Before")  
        dataAndScale = populate_map.prepareDataAndScale(data);
        console.log("scales:")
        console.log(dataAndScale)
        populate_map.populateMap("svg2985", data, dataAndScale.scale);

        populate_map.colorLegend(dataAndScale.quantiles)

        d3.select("#legend_table").attr("style", "");
      });//d3.json("../csv/countries_trials_28Oct.json").then(
    // function(data) {
  });//d3.svg("../svg/world-map_for_dashboard.svg", function(error, xml) {
});//require(["d3", "populate_map"], function(d3, populate_map) {