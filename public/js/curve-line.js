var curve_sp = $('#curve-line-sp');
var margin = {top: 20, right: 15, bottom: 30, left: 15},
    width = curve_sp.width() - margin.left - margin.right,
    height = curve_sp.height() - margin.top - margin.bottom;


var dataset_curve = [
  {x: 2000, y: 5},
  {x: 2001, y: 8},
  {x: 2002, y: 13},
  {x: 2002, y: 12},
  {x: 2004, y: 16},
  {x: 2004, y: 21},
  {x: 2006, y: 18},
  {x: 2007, y: 23},
  {x: 2007, y: 24},
  {x: 2009, y: 28},
  {x: 2010, y: 35},
  {x: 2011, y: 30},
  {x: 2012, y: 32},
  {x: 2013, y: 36},
  {x: 2014, y: 40},
  {x: 2015, y: 100},
];

var xScale_curve = d3.scale.linear()
    .domain([
      d3.min(dataset_curve, function(d){ return d.x; }), 
      d3.max(dataset_curve, function(d){ return d.x; })
    ])
    .range([0, width]);

var yScale_curve = d3.scale.linear()
    .domain([0, d3.max(dataset_curve, function(d){ return d.y; })])
    .range([height, 0]);

var xAxis_curve = d3.svg.axis()
    .scale(xScale_curve)
    .orient("bottom")
    .innerTickSize(-height)
    .outerTickSize(0)
    .ticks(5)
    .tickPadding(10)
    .tickFormat(function(d) { 
      return d;
    });

var yAxis_curve = d3.svg.axis()
    .scale(yScale_curve)
    .orient("left")
    .innerTickSize(-width)
    .outerTickSize(100)
    .tickPadding(10)
    .ticks(5)
    .tickFormat(function (d) {
      return d;
    })
    .tickFormat(function(d) { 
      return '';
    });


var line_curve = d3.svg.line()
    .x(function(d) { return xScale_curve(d.x); })
    .y(function(d) { return yScale_curve(d.y); })
    .interpolate("bundle");

var svg_curve = d3.select("#curve-line").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg_curve.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis_curve)

  svg_curve.append("g")
      .attr("class", "y axis")
      .call(yAxis_curve)


  svg_curve.append("path")
      .data([dataset_curve])
      .attr("class", "line")
      .attr("d", line_curve);
