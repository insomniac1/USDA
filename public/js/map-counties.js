import { drawBarZoomMap } from './bar-zoom-set';
import { drawTemperatureVegetation } from './temperature-vegetation';
import { drawSoilChemistry } from './soil-chemistry';
import { drawCurveLine } from './curve-line';



  var tooltip = d3.select(".tooltip"),
      tooltipState = tooltip.select("#tooltip-state");
  var tooltipOffset = [0][0];
  var loading;
  var legendIcon;
  var labels = {};
  let svg_map;
  // Elements
  var map_counties_sp = $('.map-counties-sp');
  var width_map = map_counties_sp.width();
  var height_map = width_map*0.6;
  var mapMargin = {top: 10, right: 10, bottom: 10, left: 10}

  var svg, counties, states, highlight, projection, path;
  var miniSVG, timeseries, slider, knob, x, y, xAxis, yAxis, brush, line;

  var radius = d3.scale.sqrt()
    .range([2, 40]);

  var color_map = d3.scale.threshold().range([
      "#FBF0DE", "#F7E2BC", "#F2CC89", "#E9BF77", "#DBAB58",
      "#A5E7D1", "#8EDAC1", "#64C2A2", "#3FA885", "#20906A"
      ]);
    // .range(["#20906A", "#FBF0DE", "#F7E2BC", "#F2CC89", "#E9BF77", "#DBAB58", "#A5E7D1", "#8EDAC1", "#64C2A2", "#3FA885"]);

  var thousandComma = d3.format('0,000');
  var threePrecision = d3.format('3g');
  var oneDecimal = d3.format('.1f');

  // State variables
  var isMapReady = false; // Don't bind any data unless the map data is loaded.
  var isDataReady = false;

  var uiState = {
    year: undefined,
    zoom: d3.select(null),
    mode: "NATIONAL",
    state: undefined,
    county: undefined,
  };

  var summary;

  function initUI() {
    labels.number = d3.select("#label-number"); // to remove
    labels.unit = d3.select("#label-unit"); // to remove
    labels.region = d3.select("#label-region");
    labels.year = d3.select("#label-year");

    loading = d3.select(".loading");
  }

  function initMap() {

    var vizDiv = d3.select(".map-counties-sp")[0][0];

    tooltipOffset = [vizDiv.offsetLeft, vizDiv.offsetTop];

    var width_map_ = width_map - mapMargin.left - mapMargin.right,
        height_map_ = height_map - mapMargin.top - mapMargin.bottom;

    // add svg to our template; specify general map parameters
    var mapDiv = d3.select("#map-counties");
    svg_map = mapDiv.append("svg")
      .attr("class", "map-background")
      .attr("width", width_map)
      .attr("height", height_map)
      .on("click", resetZoom)
        .append("g")
      .attr("transform", "translate(" + mapMargin.left + "," + mapMargin.top + ")");

    // add class for each county
    counties = svg_map.append("g")
      .attr("class", "counties");

    // add class for each state
    states = svg_map.append("g")
      .attr("class", "states");

    // add state contour
    highlight = svg_map.append("g")
      .attr("class", "highlight");

    projection = d3.geo.albersUsa()
      .scale(width_map)
      .translate([width_map_ / 2, height_map_ / 2]);

    path = d3.geo.path()
      .projection(projection);

    // use json data
    d3.json("/js/us.json", function(error, us) {
      if (error) throw error;

      // console.log(topojson.feature(us, us.objects.counties).features);

      counties.selectAll(".county")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter()
          .append("path")
        .attr("class", "county")
        .attr("data-county-id", function(d) {
          return d.id;
        })
        .attr("d", path)
        .on("mouseout", function() {
          destroyTooltip();  
          highlight.selectAll('*').remove();
          if (uiState.mode === 'STATE') {
            changeCounty(undefined);
          }
        })
        .on("mouseover", function(d) {
          if (!summary.county.hasOwnProperty(d.id)) {
            d3.select(this).style("cursor", "not-allowed");
            return;
          }

          d3.select(this).style("cursor", "pointer");

          highlight.append("path")
            .datum(d)
            .attr("class", "highlight-outer")
            .attr("d", path)
            .style("stroke-width", 4.5 / uiState.zoomScale + "px");
          highlight.append("path")
            .datum(d)
            .attr("class", "highlight-inner")
            .attr("d", path)
            .style("stroke-width", 1 / uiState.zoomScale + "px");

          changeCounty(d.id);
          
          // if ((summary) && (summary.length > 0) && (summary.state.length > 0) && !summary.state.hasOwnProperty(d.id)) {
          //   d3.select(this).style("cursor", "not-allowed");
          //   return;
          // }

          showTooltip(d.id);

        });

      states.selectAll(".state")
        .data(topojson.feature(us, us.objects.states).features)
        .enter()
          .append("path")
        .attr("class", function(d) { return "state state-id-" + d.id; })
        .attr("d", path)
        .on("mouseout", function() {
          highlight.selectAll('*').remove();
          if (uiState.mode === 'NATIONAL') {
            changeState(undefined);
          }

          destroyTooltip();
        })
        .on("mouseover", function(d) {

          // show appropriate tooltip on state hover
          showTooltip(d.id);

          if ((summary) && (summary.length > 0) && (summary.state.length > 0) && !summary.state.hasOwnProperty(d.id)) {
            d3.select(this).style("cursor", "not-allowed");
            return;
          }

          d3.select(this).style("cursor", "pointer");

          highlight.append("path")
            .datum(d)
            .attr("class", "highlight-outer")
            .attr("d", path);
          highlight.append("path")
            .datum(d)
            .attr("class", "highlight-inner")
            .attr("d", path);
          changeState(d.id);
        })
        .on("click", function(d) {
          d3.event.stopPropagation();
          if (!summary.state.hasOwnProperty(d.id)) {
            return;
          }
          zoomed(d);
        });

      isMapReady = true;
    });
  }

  // function initTimeseries() {
    var timeseriesDiv = d3.select(".timeseries");
    var margin = {top: 10, right: 20, left: 50},
      width_map_ = width_map - margin.left - margin.right;

    var lineChartHeight = 64;

    x = d3.scale.linear()
      .range([5, width_map_ - 5])
      .clamp(true);

    y = d3.scale.linear()
      .domain([0, 100])
      .range([lineChartHeight-5, 5]);


    miniSVG = timeseriesDiv.append("svg")
      .attr("width", width_map)
      .attr("height", 140)
        .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    timeseries = miniSVG.append("g")
    timeseries.append("rect")
      .attr("class", "background")
      .attr("width", width_map_)
      .attr("height", lineChartHeight);

    yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(4)
      .tickSize(-width_map_)
      .tickPadding(12)
      .tickFormat(d3.format("s"));

    timeseries.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(function(d) { return d; })
      .tickSize(-lineChartHeight)
      .ticks(12)
      .tickPadding(12);

    timeseries.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + lineChartHeight + ")")
      .call(xAxis);

    line = d3.svg.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); });


  function resetZoom() {
    uiState.zoom = d3.select(null);
    highlight.selectAll('*').remove();

    svg_map.transition()
      .duration(500)
      .ease("exp-out")
      .attr('data-zoom', false)
      .attr("transform", "translate(" + mapMargin.left + "," + mapMargin.top + ")");

    setTimeout(function() {
      states.selectAll("*")
        .style("visibility", "visible");
      counties.selectAll(".county")
        .style("visibility", "visible")
        .style("stroke-width", "0.5px");
    }, 500);

    uiState.mode = 'NATIONAL';
    changeState(undefined);
  }

  function zoomed(state, type) {
    if(type != 'select'){
      d3.event.stopPropagation()
    }


    // TO-DO: If no data, return.

    if (uiState.zoom.node() === this) {
      resetZoom();
      return;
    }

    var width_map_ = width_map - mapMargin.left - mapMargin.right,
        height_map_ = height_map - mapMargin.top - mapMargin.bottom;

    uiState.zoom = d3.select(this);

    var bounds = path.bounds(state),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .8 / Math.max(dx / width_map_, dy / height_map_),
      translate = [width_map_ / 2 - scale * x, height_map_ / 2 - scale * y];

    uiState.zoomScale = scale;

    svg_map.transition()
      .duration(500)
      .attr('data-zoom', true)
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");


    highlight.selectAll('*').remove();

    states.selectAll("*")
      .style("visibility", "hidden");

    counties.selectAll(".county")
      .style("visibility", function(d) {
        if (Math.floor(d.id / 1000) === state.id) {
          return "visible";
        }
        return "hidden";
      })
      .style("stroke-width", 1.0 / scale + "px");

    uiState.mode = 'STATE';
  }

  function slided() {
    var value = Math.round(brush.extent()[0]);

    if (d3.event.sourceEvent) {
      value = Math.round(x.invert(d3.mouse(this)[0]));
      brush.extent([value, value]);
    }

    handle.selectAll("circle")
      .transition()
      .duration(25)
      .attr("cx", x(value));

    changeYear(value);
  }

  function changeState(stateID) {
    uiState.state = stateID;
    updateTimeseries();
    if (uiState.state === undefined) {
      labels.region.html('United States');
    } else if (summary) {
      if(summary && summary.state && summary.state[stateID]){
        labels.region.html(summary.state[stateID].name);
      }
    }
    updateStateLabel(stateID);
  }

  function changeYear(year) {
    uiState.year = year;

    updateMap();
    updateTimeseries(); // TO-DO: Consider removing this.

    labels.year.html(year);
    updateStateLabel();
  }

  function changeCounty(countyID) {
    uiState.county = countyID;
    updateTimeseries();
    // console.log(summary.state[uiState.state].name);
    // console.log(summary.county[countyID].name);
    if (uiState.county === undefined) {
      // labels.region.html(summary.state[uiState.state].name);
    } else {
      // labels.region.html(summary.county[countyID].name);
    }
    updateCountyLabel(countyID)
  }

  function updateStateLabel(stateID) {
    if(stateID && summary) {
      if(summary && summary.state && summary.state[stateID]){
        $('#tooltip-state').html(summary.state[stateID].name);
      }
    }
  }

  function updateCountyLabel(countyID) {
    if(countyID && summary) {
      var countyName = (summary.county[countyID].name) ? summary.county[countyID].name : countyID;
      $('#tooltip-state').html(countyName);
    }
  }


  export function updateDataMap(type = 'yield') {
    isDataReady = false;


    loading.select(".spinner").classed("hidden_elem", false);
    loading.select(".error").classed("hidden_elem", true);
    loading.classed("hidden_elem", false);

    d3.json('/js/us-data-' + type + '.json', function(err, json) {

      if (err) throw err;

      summary = json;

      // console.log(summary.county.)

      color_map.range(summary.metadata.colorRange); // From file us-data.js
      color_map.domain(summary.metadata.colorQuantiles); // From file us-data.js

      x.domain(summary.metadata.yearRange);
      timeseries.select("g.x.axis")
        .call(xAxis);

      labels.unit.html(summary.metadata.unit.toLowerCase());

      if (uiState.mode === 'STATE' &&
        !summary.state.hasOwnProperty(uiState.state)) {
        resetZoom();
      } else {
        changeState(uiState.state);
      }

      if (uiState.year &&
          uiState.year <= summary.metadata.yearRange[1] &&
          uiState.year >= summary.metadata.yearRange[0]) {
        changeYear(uiState.year);
      } else {
        changeYear(summary.metadata.yearRange[1]);
      }

      isDataReady = true;

      updateMap();
      updateTimeseries();
      updateStateLabel();

      loading.classed("hidden_elem", true);
    });
  }

  function updateMap() {
    if (!isMapReady || !isDataReady) return;

    counties.selectAll(".county")
      .style("fill", function(d) {
        if (summary.county.hasOwnProperty(d.id) &&
          summary.county[d.id].data.hasOwnProperty(uiState.year)) {
          return color_map(summary.county[d.id].data[uiState.year]);
        }
        return "#fff";
      })
  }

  function updateTimeseries() {
    if (!isMapReady || !isDataReady) return;

    var dat, extent;
    if (uiState.mode === "NATIONAL") {
      if (uiState.state) {
        dat = summary.state[uiState.state];
      } else {
        dat = summary.national;
      }
    } else if (uiState.mode === "STATE") {
      if (uiState.county) {
        dat = summary.county[uiState.county];
      } else {
        dat = summary.state[uiState.state];
      }
    }

    if (dat === undefined || dat.data == null) return;

    var lineData = Object.keys(dat.data)
      .map(function(d) {
        return {x: +d, y: dat.data[d]};
      });

    console.log('updateTimeseries()');
    y.domain(dat.yRange);
    timeseries.select("g.y.axis")
      .call(yAxis);

    timeseries.selectAll(".line").remove();
    timeseries.append("path")
      .attr("class", "line")
      .attr("d", line(lineData));
  }

  function destroyTooltip() {
    tooltip.style("opacity", 0);
  }
  
  function showTooltip(d) {
    if (!isDataReady) return;

    var coordinates = [0, 0];
    coordinates = d3.mouse(d3.event.currentTarget);
    var x_mouse = coordinates[0];
    var y_mouse = coordinates[1];

    tooltip.style("visibility", "visible")
      .style("opacity", 1)
      .style("margin-top", "-50px")
      .style("left", x_mouse - tooltipOffset[0] + "px")
      .style("top", y_mouse + "px")

  }

  $("#searchCounty").on("select2:select change.select2", function(e) {
    
    var originalKey_str = $(this).val();
    
    $('.loading_sp').each(function(){
      $(this).css('display','block');
    });

    
    var originalKey = originalKey_str.split("-");

    var state_id = Math.floor(originalKey[0]/1000);
    var countyID = originalKey[1];
    var stateName = originalKey[2].replace('_', ' ');

    var selectedCounty = $(this).find('option[value="' + originalKey_str + '"]').html();
    $(".selectedCountyName").each(function(){
      $(this).text(selectedCounty);
    });

    $.ajax({
      type: 'GET',
      data: { 
        id: countyID,
        state: stateName
      },
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      url: '/api/data/',
      success: function(data) {
        console.log(data);
        console.log('data updated');
        
        if(data.length == 0){
          data.push({
            area_symbol: countyID,
            years: [],
            soil_chemistry: [],
            bar_map: []
          })
        }

        if(data[0].years.length == 0){
          data[0].years = [
              {
                carbon:0,
                cropquality:0,
                latitude:0,
                longitude:0,
                soil_quality:0,
                state:'',
                temperature:0,
                vegetation:0,
                water:0,
                year: "2017",
                yield:0
              }
          ]
        }

        if(data[0].bar_map.length == 0){
          data[0].bar_map = [
              {
                year:"2001",
                values: [
                  {
                    rate:"Yield",
                    value: 0
                  },
                  {
                    rate:"Acres",
                    value: 0
                  },
                  {
                    rate:"Production",
                    value: 0
                  }
                ]
              }
          ]
        }
        

        $('.loading_sp').each(function(){
          $(this).css('display','none');
        });


        drawBarZoomMap(data[0].bar_map);
        drawSoilChemistry(data[0].soil_chemistry);
        drawTemperatureVegetation(data);
        drawCurveLine(data[0].years);

        var predictedData = JSON.parse($("#predicted-data").val());

        predictedData.date = 2018;
        predictedData.longitude = data[0].years[0].longitude;
        predictedData.latitude = data[0].years[0].latitude;
        predictedData.cropquality = data[0].years[0].cropquality;
        predictedData.wateravailability = $("#slider-water").val();
        predictedData.temperature = $("#round-temperature").find('input').val();
        predictedData.vegetation = $("#round-vegetation").find('input').val() / 100;
        predictedData.soilcarbon = $("#slider-carbon").val();
        predictedData.soilquality = $("#slider-soil").val();

        var textObject = JSON.stringify(predictedData);
        $("#predicted-data").text(textObject);
      }
    });

    resetZoom();

    var first_g = $('[data-zoom="true"]');
    var zoom_delay = 600;
    if(first_g.length > 0){
      zoom_delay = 1000;
    }

    setTimeout(function () {
      var itm_county = svg_map.selectAll(".state-id-"+state_id)
        .attr("data-id", function(d){
          zoomed(d, 'select');
          return d.id;
        });
    }, zoom_delay);

  });


  initUI();
  initMap();
  window.setTimeout(updateDataMap, 1500);
