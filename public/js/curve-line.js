export function drawCurveLine(dataset_curve) {

  $("#curve-line").html('');
  
  var curve_sp = $('#curve-line-sp');

  var margin = {top: 20, right: 15, bottom: 30, left: 15},
      width = curve_sp.width() - margin.left - margin.right,
      height = curve_sp.height() - margin.top - margin.bottom;
  
 
    var xScale_curve = d3.scale.linear()
        .domain([
          d3.min(dataset_curve, function(d){ return d.year; }), 
          d3.max(dataset_curve, function(d){ return d.year; })
        ])
        .range([0, width]);

    var yScale_curve = d3.scale.linear()
        .domain([0, d3.max(dataset_curve, function(d){ return d.yield; })])
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
        .x(function(d) { return xScale_curve(d.year); })
        .y(function(d) { return yScale_curve(d.yield); })
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

}
