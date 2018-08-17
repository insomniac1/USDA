(function() {


  var tooltip = d3.select(".tooltip"),
      tooltipState = tooltip.select("#tooltip-state"),
      tooltipContent = tooltip.select("#tooltip-content");
  var tooltipOffset = [0][0];
  var loading;
  var listview, listviewTable;
  var legendIcon;
  var labels = {};


  // Elements
  var map_counties_sp = $('.map-counties-sp');
  var width_map = map_counties_sp.width();
  var height_map = width_map*0.6;
  var mapMargin = {top: 10, right: 10, bottom: 10, left: 10}

  var svg, counties, states, highlight, projection, path;
  var miniSVG, timeseries, slider, knob, x, y, xAxis, yAxis, brush, line;

  var radius = d3.scale.sqrt()
    .range([2, 40]);
  var color_map = d3.scale.threshold()
      .range(["#FBF0DE", "#F7E2BC", "#F2CC89", "#E9BF77", "#DBAB58", "#A5E7D1", "#8EDAC1", "#64C2A2", "#3FA885", "#20906A"]);






  var thousandComma = d3.format('0,000');
  var threePrecision = d3.format('3g');
  var oneDecimal = d3.format('.1f');

  // State variables
  var isMapReady = false; // Don't bind any data unless the map data is loaded.
  var isDataReady = false;

  var dataSelection = {
    // default
    commodity: "barley",
    stat: "planted"
  };
  var uiState = {
    year: undefined,
    zoom: d3.select(null),
    mode: "NATIONAL",
    state: undefined,
    county: undefined,
    listview: false
  };

  var summary;

  function initUI() {

    var statIcons = d3.selectAll(".icon.stat")
      .on("click", function(d) {
        var elem = d3.select(this);
        d3.selectAll(".icon.stat")
          .classed("active", false);
        elem.classed("active", true);
        dataSelection.stat = elem.attr("id");
        updateData();
      });

    var modeIcon = d3.select(".icon.mode")
      .on("click", function(d) {
        $('.icon.mode').tooltip('hide'); // qwe
        var elem = d3.select(this);
        if (elem.classed("icon-list-view")) {
          elem.classed("icon-list-view", false)
            .classed("icon-map-view", true)
            .attr("data-original-title", "Map View");
          // showList();
        } else {
          elem.classed("icon-list-view", true)
            .classed("icon-map-view", false)
            .attr("data-original-title", "List View");
          // hideList();
        }
        $('.icon.mode').tooltip('show'); // qwe
      })

    listview = d3.select(".listview");
    listviewTable = listview.select(".table-div table");

    labels.commodity = d3.select("#label-commodity");
    labels.stat = d3.select("#label-stat");
    labels.number = d3.select("#label-number");
    labels.unit = d3.select("#label-unit");
    labels.region = d3.select("#label-region");
    labels.year = d3.select("#label-year");

    loading = d3.select(".loading");
  }

  function initMap() {

    var vizDiv = d3.select(".map-counties-sp")[0][0];
    // console.log($(vizDiv));
    tooltipOffset = [vizDiv.offsetLeft, vizDiv.offsetTop];

    var width_map_ = width_map - mapMargin.left - mapMargin.right,
        height_map_ = height_map - mapMargin.top - mapMargin.bottom;

    var mapDiv = d3.select("#map-counties");
    svg = mapDiv.append("svg")
      .attr("class", "map-background")
      .attr("width", width_map)
      .attr("height", height_map)
      .on("click", resetZoom)
        .append("g")
      .attr("transform", "translate(" + mapMargin.left + "," + mapMargin.top + ")");

    counties = svg.append("g")
      .attr("class", "counties");

    states = svg.append("g")
      .attr("class", "states");

    highlight = svg.append("g")
      .attr("class", "highlight");

    projection = d3.geo.albersUsa()
      .scale(width_map)
      .translate([width_map_ / 2, height_map_ / 2]);

    path = d3.geo.path()
      .projection(projection);

    d3.json("/js/us.json", function(err2, us) {
      if (err2) throw err2;

      counties.selectAll(".county")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter()
          .append("path")
        .attr("class", "county")
        .attr("d", path)
        .on("mouseout", function() {
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
        });

      states.selectAll(".state")
        .data(topojson.feature(us, us.objects.states).features)
        .enter()
          .append("path")
        .attr("class", function(d) { return "state state-id-" +d.id;})
        .attr("d", path)
        .on("mouseout", function() {
          highlight.selectAll('*').remove();
          if (uiState.mode === 'NATIONAL') {
            changeState(undefined);
          }
        })
        .on("mouseover", function(d) {

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

    svg.transition()
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

    if (uiState.listview) {
      d3.select(".icon.mode")
        .classed("icon-list-view", true)
        .classed("icon-map-view", false)
        .attr("data-original-title", "List View");
      // hideList();
    }
  }

  function zoomed(state, type = null) {

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

    svg.transition()
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
    } else {
      labels.region.html(summary.state[stateID].name);
    }
    updateNumberLabel();
  }

  function changeYear(year) {
    uiState.year = year;

    updateMap();
    updateTimeseries(); // TO-DO: Consider removing this.

    if (uiState.listview) {
      // updateList();
    }

    labels.year.html(year);
    updateNumberLabel();
  }

  function changeCounty(countyID) {
    uiState.county = countyID;
    updateTimeseries();
    // console.log(summary.state[uiState.state].name);
    // console.log(summary.county[countyID].name);
    if (uiState.county === undefined) {
      labels.region.html(summary.state[uiState.state].name);
    } else {
      labels.region.html(summary.county[countyID].name);
    }
    updateNumberLabel()
  }

  function updateNumberLabel() {
    var value;
    if (uiState.mode == 'NATIONAL') {
      if (uiState.state) {
        value = summary.state[uiState.state].data[uiState.year];
      } else {
        value = summary.national.data[uiState.year];
      }
    } else if (uiState.mode == 'STATE') {
      if (uiState.county) {
        value = summary.county[uiState.county].data[uiState.year];
      } else {
        value = summary.state[uiState.state].data[uiState.year];
      }
    }

    if (value === undefined) {
      labels.number.html("n/a");
      labels.unit.html("");
    } else {
      labels.number.html(thousandComma(value));
      labels.unit.html(summary.metadata.unit.toLowerCase());
    }

    $('#tooltip-state').html(summary.metadata.unit.toLowerCase());
    $('#tooltip-content').html(thousandComma(value));
  }

  function updateData() {
    isDataReady = false;


    loading.select(".spinner").classed("hidden_elem", false);
    loading.select(".error").classed("hidden_elem", true);
    loading.classed("hidden_elem", false);

    var filename;

    filename = '/js/us-data-show.json';

    d3.json(filename, function(err, json) {
      if (err) throw err;

      summary = json;

      color_map.domain(summary.metadata.colorQuantiles);

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

      if (uiState.listview) {
        // showList();
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
      updateNumberLabel();

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

    if (dat === undefined) return;

    var lineData = Object.keys(dat.data)
      .map(function(d) {
        return {x: +d, y: dat.data[d]};
      });

    y.domain(dat.yRange);
    timeseries.select("g.y.axis")
      .call(yAxis);

    timeseries.selectAll(".line").remove();
    timeseries.append("path")
      .attr("class", "line")
      .attr("d", line(lineData));

    timeseries.selectAll(".point").remove()
    if (dat.data.hasOwnProperty(uiState.year)) {
      timeseries.append("circle")
        .attr("class", "point selected")
        .attr("r", 4)
        .attr("cx", x(uiState.year))
        .attr("cy", y(dat.data[uiState.year]));
    }
  }


  function showTooltip(d) {
    if (!isDataReady) return;

    tooltip.style("visibility", "visible")
      .style("opacity", 1)
      .style("position", "fixed")


      .style("left", d3.event.screenX - tooltipOffset[0]*4 + "px")
      .style("top", d3.event.screenY - tooltipOffset[1]*4 + "px");

  }

  $(function () {
    $('[data-toggle="tooltip"]').tooltip() // qwe
  })

  // zoomed(d);states.selectAll(".state")
  $('#select_county').on('change', function(){
      var itm = $(this),
          itm_id = itm.val();
      resetZoom();

      var first_g = $('[data-zoom="true"]');
      var zoom_delay = 600;
      if(first_g.length > 0){
        zoom_delay = 1000;
      }

      setTimeout(function () {
          var itm_county = svg.selectAll(".state-id-"+itm_id)
            .style("fill", "red")
            .attr("data-id", function(d){
              zoomed(d, 'select');
              return d.id;
            });
      }, zoom_delay);

  });

  initUI();
  initMap();
  window.setTimeout(updateData, 1500);

})();
