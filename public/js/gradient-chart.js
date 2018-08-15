var area_ContainerID = "#chart-gradient";
var area_chart_sp = $('.gradient-wrapper');
var margin = {top: 0, right: 0, bottom: 30, left: 0},
    width_area  = area_chart_sp.width() - margin.left - margin.right,
    height_area = area_chart_sp.height()  - margin.top  - margin.bottom;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width_area], .1);

var y_area = d3.scale.linear()
  .rangeRound([height_area, 0]);

var xAxis_area = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .tickSize(1);

var yAxis_area = d3.svg.axis()
    .scale(y_area)
    .orient("left")
    .innerTickSize(-width_area)
    .outerTickSize(0)
    .tickPadding(10);

// var line_axis = d3.svg.line()
//     .x(function(d) { return xScale(d.x); })
//     .y(function(d) { return yScale(d.y); });

var stack = d3.layout.stack()
  .offset("zero")
  .values(function (d) { return d.values; })
  .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
  .y(function (d) { return d.value; });

var area = d3.svg.area()
  .interpolate("curveLinear")
  .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
  // .y0(function (d) { return y_area(d.y0); })
  .y1(function (d) { return y_area(d.y); });

var color_area = d3.scale.ordinal()
  .range(["#44A484", "#76C6CC"]);

// var lineFunction = d3.svg.line()
//                    .x(function(d) { return d.x; })
//                    .y(function(d) { return d.y; })
//                    .interpolate("linear");

var svg_area = d3.select(area_ContainerID).append("svg")
  .attr("width",  width_area  + margin.left + margin.right)
  .attr("height", height_area + margin.top  + margin.bottom)
  .append("g")
  // .attr('viewBox','0 0 '+Math.min(width_area,height_area)+' '+Math.min(width_area,height_area))
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var area_chart = d3.csv("/api/gradient-area-data.csv", function (error, data) {

    var labelVar = 'year';

    var varNames = d3.keys(data[0])
      .filter(function (key) { return key !== labelVar;});

    color_area.domain(varNames);

    var seriesArr = [], series = {};
    varNames.forEach(function (name) {
      series[name] = {name: name, values:[]};
      seriesArr.push(series[name]);
    });

    data.forEach(function (d) {
      varNames.map(function (name) {
        series[name].values.push({name: name, label: d[labelVar], value: +d[name]});
      });
    });

    x.domain(data.map(function (d) { return d.year; }));

    stack(seriesArr); // ???

    y_area.domain([0, d3.max(seriesArr, function (c) { 
      console.log(c);
      return d3.max(c.values, function (d) { return d.y; });
    })]);

    svg_area.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height_area + ")")
      .call(xAxis_area)

    var selection = svg_area.selectAll(".series")
      .data(seriesArr)
      .enter().append("g")
      .attr("class", function(d, i) { return "series series-" + i; });

    /* Start GRADIENT */
    var gradient_svg = $(area_ContainerID).find('svg')[0];
    createGradient(gradient_svg,'temperature-gradient-0',[ // Create gradient
        { offset: '0%', 'stop-color': '#76C6CC','stop-opacity': '1' },
        { offset: '100%', 'stop-color': '#76C6CC', 'stop-opacity': '0.15' }
    ]);
    createGradient(gradient_svg,'temperature-gradient-1',[ // Create gradient
        { offset: '0%', 'stop-color': '#44A484 ', 'stop-opacity': '0.05' },
        { offset: '100%', 'stop-color': '#44A484', 'stop-opacity': '0.05' }
    ]);
    createGradient(gradient_svg,'temperature-gradient-2',[ // Create gradient
        { offset: '0%', 'stop-color': '#000 ', 'stop-opacity': '0.05' },
        { offset: '100%', 'stop-color': '#000', 'stop-opacity': '0.05' }
    ]);
    /* Stop GRADIENT */

    selection.append("path")
      .attr("d", function (d) { return area(d.values); })
      // .style("stroke", function (d, i) {return color_area(i); })
      .attr("class", "streamPath")
      .style("stroke-width", 2)
      .style('fill', function(d, i) {
        return 'url(#temperature-gradient-' + i + ')';
      });

    function removePopovers (d) {}
    function showPopover (d) {}

});

function createGradient(svg,id,stops) {
    var svgNS = svg.namespaceURI;

    var grad  = document.createElementNS(svgNS, 'linearGradient');
    grad.setAttribute('id',id);

    // make gradient from top to bottom
    grad.setAttribute('x2', '0%');
    grad.setAttribute('y2', '100%');

    for (var i = 0; i < stops.length; i++) {
        var attrs = stops[i];
        var stop = document.createElementNS(svgNS, 'stop');

        for (var attr in attrs){
            if (attrs.hasOwnProperty(attr)) stop.setAttribute(attr,attrs[attr]);
        }
        grad.appendChild(stop);
    }

    var defs = svg.querySelector('defs') || svg.insertBefore( document.createElementNS(svgNS,'defs'), svg.firstChild);
    // var defs = document.createElementNS(svgNS,'defs');
    // $("#chart-gradient").find('svg .series-0').append(defs);
    return defs.appendChild(grad);
}