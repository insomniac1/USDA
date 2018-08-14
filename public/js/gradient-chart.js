var margin = {top: 20, right: 55, bottom: 30, left: 40},
  width_area  = 1000 - margin.left - margin.right,
  height_area = 500  - margin.top  - margin.bottom;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width_area], .1);

var y_area = d3.scale.linear()
  .rangeRound([height_area, 0]);

var xAxis_area = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis_area = d3.svg.axis()
  .scale(y_area)
  .orient("left");

var stack = d3.layout.stack()
  .offset("zero")
  .values(function (d) { return d.values; })
  .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
  .y(function (d) { return d.value; });

var area = d3.svg.area()
  .interpolate("curveLinear")
  .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
  .y0(function (d) { return y_area(d.y0); })
  .y1(function (d) { return y_area(d.y0 + d.y); });

var color_area = d3.scale.ordinal()
  .range(["#001c9c","#101b4d","#475003","#9c8305","#d3c47c"]);

var svg_area = d3.select("#chart-gradient").append("svg")
  .attr("width",  width_area  + margin.left + margin.right)
  .attr("height", height_area + margin.top  + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var area_chart = d3.csv("/api/gradient-area-data.csv", function (error, data) {

    var labelVar = 'quarter';
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

    x.domain(data.map(function (d) { return d.quarter; }));

    stack(seriesArr);

    y_area.domain([0, d3.max(seriesArr, function (c) { 
        return d3.max(c.values, function (d) { return d.y0 + d.y; });
      })]);

    svg_area.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height_area + ")")
        .call(xAxis_area);

    svg_area.append("g")
        .attr("class", "y axis")
        .call(yAxis_area)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of Rounds");

    var selection = svg_area.selectAll(".series")
      .data(seriesArr)
      .enter().append("g")
        .attr("class", function(d, i) { return "series series-" + i; });

    /* QWE => Start GRADIENT */

    selection.append("linearGradient")
          .attr("id", function(d, i) { return "temperature-gradient-" + i; })
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", 0).attr("y1", y_area(50))
          .attr("x2", 0).attr("y2", y_area(60))
        .selectAll("stop")
          .data([
            {offset: "0%", color: "blue"},
            // {offset: "50%", color: "gray"},
            {offset: "100%", color: "red"}
          ])
        .enter().append("stop")
          .attr("offset", function(d) { return d.offset; })
          .attr("stop-color", function(d) { return d.color; });



    /* STOP GRADIENT */


    selection.append("path")
      .attr("class", "streamPath")
      .attr("d", function (d) { return area(d.values); })
      .style("fill", function (d) { return color_area(d.name); })
      .style("stroke", "grey");

    var points = svg_area.selectAll(".seriesPoints")
      .data(seriesArr)
      .enter().append("g")
        .attr("class", "seriesPoints");

    points.selectAll(".point")
      .data(function (d) { return d.values; })
      .enter().append("circle")
       .attr("class", "point")
       .attr("cx", function (d) { return x(d.label) + x.rangeBand() / 2; })
       .attr("cy", function (d) { return y_area(d.y0 + d.y); })
       .attr("r", "1px")
       .style("fill",function (d) { return color_area(d.name); })
       .on("mouseover", function (d) { showPopover.call(this, d); })
       .on("mouseout",  function (d) { removePopovers(); })

    var legend = svg_area.selectAll(".legend")
        .data(varNames.slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(55," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width_area - 10)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color_area)
        .style("stroke", "grey");

    legend.append("text")
        .attr("x", width_area - 12)
        .attr("y", 6)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });

    function removePopovers () {
      // $('.popover').each(function() {
      //   $(this).remove();
      // }); 

      console.log('Close POPOVER');
      
    }

    function showPopover (d) {
    	
    	console.log('Open POPOVER');

      // $(this).popover({
      //   title: d.name,
      //   placement: 'auto top',
      //   container: 'body',
      //   trigger: 'manual',
      //   html : true,
      //   content: function() { 
      //     return "Quarter: " + d.label + 
      //            "<br/>Rounds: " + d3.format(",")(d.value ? d.value: d.y1 - d.y0); }
      // });
      // $(this).popover('show')
    }

});