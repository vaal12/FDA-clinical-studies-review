
require.config({
    paths: {
        d3: "../js/d3/d3.min",
        c3: "../js/c3.min"
    }
});

function makeCountryChart(data, elementClicked) {
    console.log(d3.select(elementClicked).datum());
    nct_ids = []
    years = []

    for (year in data) {
        // console.log(year)
        years.push(year);
        nct_ids.push(data[year].nct_id);
    }

    // console.log(""+d3.max(years)+"  "+d3.min(years));
    // console.log(years[0])
    max_year = d3.max(years)
    curr_year = d3.min(years);
    i = 0;
    real_nct_ids = ["nct_id"];
    real_years = ["ticks"]
    while (curr_year <= max_year) {
        if (curr_year == years[i]) {
            real_nct_ids.push(nct_ids[i])
            real_years.push(years[i])
            i++;
        }
        else {
            real_nct_ids.push(0)
            real_years.push(curr_year)
        }
        curr_year++;
    }
    d3.select("#country_graph").text("");
    var chart = c3.generate({
        bindto: '#country_graph',
        size: {
            height: 160,
            width: 380
        },
        data: {
            x: "ticks",
            columns: [
                real_nct_ids,
                real_years,
            ],
            labels: true,
            type: 'bar'
        },
        legend: {
            text: "I am a abar",
            show: false,
        },
        axis: {
            y: {
                show: false
            },
            x: {
                label: {
                    text: "year",
                    position: 'outer-right'
                },
                // type: 'timeseries',
                // tick: {
                //     // this also works for non timeseries data
                //     values: ['1999bis', '2000', "2001", "2002", "2003", "2004"]
                // }
            }
        },
        tooltip: {
            grouped: false,
            position: function (data, width, height, element) {
                // console.log(element)
                // console.log(this);
                var chartOffsetX = document.querySelector("#country_graph").getBoundingClientRect().left;
                var graphOffsetX = document.querySelector("#country_graph g.c3-axis-y").getBoundingClientRect().right;
                // var tooltipWidth = document.getElementById('tooltip').parentNode.clientWidth;
                var tooltipWidth = 50;
                var x = (parseInt(element.getAttribute('cx'))) + graphOffsetX - chartOffsetX - Math.floor(tooltipWidth / 2);
                var y = element.getAttribute('cy');
                var y = y - height - 14;
                return { top: y, left: x }
            },
            // contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
            //   d = Math.floor(d[0].value)
            //   return '<div id="tooltip" class="module-triangle-bottom">' + d + ' wows</div>'
            // }
        }
    });//var chart = c3.generate({
}//END function makeCountryChart(data) {


function mapClicked(elementClicked) {
    d3.select("#left_container").transition().duration(1000)
        .style("transform", "scale(0.001, 1)")
        .on("end", function (d) {
            country_data = d3.select(elementClicked).datum();
            // country_name = d3.select(elementClicked).datum().full_country_name;
            d3.select("#country_title").text(country_data.full_country_name);
            d3.select("#country_wiki").html("<a href=" + country_data.wiki_link + " target=\"_blank\">Country wiki</a>");
            if(country_data.population != -1) {
                d3.select("#country_population").text("Population:" + country_data.population);
            }
            else {
                d3.select("#country_population").text("Population: no data");
            }
            if(country_data.area != -1) {
                d3.select("#country_area").text("Area: " + country_data.area + " sq.km");
            }
            else d3.select("#country_area").text("Area: no data");
            
            if(country_data.flag != -1) {
                d3.select("#country_flag").text("")
                d3.select("#country_flag").append("img").attr("src", country_data.flag)
            }
            else d3.select("#country_flag").text("")

            country_json = d3.json("../json/" + country_data.full_country_name + ".json").then(function (data) {
                console.log(data);
                makeCountryChart(data, elementClicked);
                d3.select("#left_container")
                    .transition().duration(500)
                    .style("transform", "scale(1, 1)");
            })
                .catch(function (error) {
                    d3.select("#country_graph").text("Error downloading data");

                    d3.select("#left_container")
                        .transition().duration(500)
                        .style("transform", "scale(1, 1)");
                });//country_json = d3.json("../json/Albania.json").then(function(data) {
        })//.on("end", function(d) {
}//END function mapClicked(d3Obj, plotlyObj, elementClicked) {


define(["c3"], function (c3) { return {
        populateMap: function (svg_map_elem_id, data, quantile_scale) {
            window.c3 = c3;

            // console.log
            
            svg_elem = d3.select("#countries_map");
            // console.log(svg_elem);
            svg_elem.selectAll("g").each(function (d) {
                this_tag_id = d3.select(this).attr("id")
                // console.log(d3.select(this).attr("id"))
                // console.log(data[this_tag_id])
                if (typeof data[this_tag_id] === 'undefined') {
                    // console.log("No data");
                }//END  if(typeof data[this_tag_id] === 'undefined') {
                else {// if(typeof data[this_tag_id] === 'undefined') {

                    d3.select(this).selectAll("path, circle").each(
                        function () {
                            d3.select(this).attr(
                                "fill",
                                quantile_scale(data[this_tag_id].number_for_map_color)
                            )
                                .attr("stroke",
                                    quantile_scale(data[this_tag_id].number_for_map_color)
                                )
                                .classed('circlexx', false);
                        }
                    );//d3.select(this).selectAll("path").each(
                    d3.select(this).select("title").text(
                        data[this_tag_id].full_country_name + ":  " +
                        data[this_tag_id].number_for_map_color
                    )

                    d3.select(this)
                        .datum(data[this_tag_id])
                        .on("click", function () {
                            mapClicked(this)
                        });
                }//END else {// if(typeof data[this_tag_id] === 'undefined') {
            });//END svg_elem.selectAll("g").each(function(d) {

            //Removing extra circles, which do not have data available for them on the map
            svg_elem.selectAll(".circlexx").remove();

            // svg_elem.selectAll("g").each(
            //     function() {
            //         d3.select(this).on("click", function() {
            //                 mapClicked(this)
            //             }
            //         );
            // })//END svg_elem.selectAll("g").each(
        },//populateMap: function(svg_map_elem_id, data, quantile_scale) {
        prepareDataAndScale : function(data) {
            //CREATE NEW DATA FIELD
            //Populate it based on selector
            selection_val = d3.select('#mapModeSelector').property('value');
            for (var cnt in data) {
                if(selection_val == "rawNumber")
                    data[cnt].number_for_map_color = data[cnt].nct_id_count;
                if(selection_val == "byPopulation") {
                    console.log(cnt)
                    console.log(data[cnt])
                    // console.log("Creating by population")
                    per_capita = Math.floor((data[cnt].nct_id_count*100000000) / data[cnt].population)/100
                    console.log("Per capita:"+per_capita)
                    data[cnt].number_for_map_color = per_capita
                }
                // if(selection_val == "byArea")
                //     data[cnt].number_for_map_color = data[cnt].nct_id_count;
                
            }

            var data_counts_arr = []
            for (var cnt in data) {
              // console.log(cnt)
              if(data[cnt].number_for_map_color >=0 )
                data_counts_arr.push(data[cnt].number_for_map_color)
            }
            data_counts_arr.sort(function (a, b) { return a - b });
            console.log("data_counts_arr")
            console.log(data_counts_arr);

            //GENERATE SCALES
            //Chromatic scales: https://github.com/d3/d3-scale-chromatic
            var quantile_scale = d3.scaleQuantile()
            // var quantile_scale = d3.scaleThreshold()
            // var quantile_scale = d3.scaleQuantize()
                .domain(data_counts_arr)
                // .range( d3.schemeBlues[9]);
                .range( d3.schemeYlGnBu[9]);

            //CREATE QUANTILES ARRAY
            good_quantiles = [0];
            var i = 0;
            while (i < quantile_scale.quantiles().length) {
                // console.log(quantile_scale.quantiles()[i]);
                good_quantiles.push(quantile_scale.quantiles()[i]);
                i++;
            }
    
            good_quantiles.push(d3.max(data_counts_arr));

            console.log("good quantiles:"+good_quantiles)
            // console.log("Good quantiles:"+good_quantiles);

            return {
                scale: quantile_scale, 
                quantiles: good_quantiles,
                data: data
            }//return {
        },//prepareDataAndScale : function(data) {
        colorLegend: function(dataAndScale)  {
            i = 0;
            while (i < (dataAndScale.quantiles.length - 1)) {
                curr_color = dataAndScale.scale(dataAndScale.quantiles[i]);
                legend_text = "" + Math.floor(dataAndScale.quantiles[i]) + "-" +
                (Math.floor(dataAndScale.quantiles[i + 1]) - 1);
    
                // console.log("color:"+curr_color);
                // console.log("Inverted:"+invertColor(curr_color))
                d3.select("#legend" + (i + 1))
                    .attr("style", "background-color:" + curr_color + "; color:" + invertColor(curr_color))
                    .text(legend_text);
                i++;
            };//while(i<(good_quantiles.length-1)) {
        },//colorLegend: function(good_quantiles)  {
}});//END define(["d3"], function(d3){ return {


//HELPER COLOR FUNCTIONS
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