function drawFinalScatterplot() {
  /*
  ** Set up
   */

  var mobileScreen = document.getElementById("chart-circle-wrapper").offsetWidth < 550 ? true : false;
  var circle_chart_sp = $('#chart-circle-wrapper');

  // Scatterplot
  var margin = {left: 30, top: 20, right: 20, bottom: 30},
    width_circle = circle_chart_sp.width() - margin.left - margin.right,
    height = width_circle*2/3;

  var svg_cicle = d3.select("#chart-circle").append("svg")
    .attr("width", (width_circle + margin.left + margin.right))
    .attr("height", (height + margin.top + margin.bottom));

  var wrapper = svg_cicle.append("g").attr("class", "chordWrapper")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  /*
  ** Initialize Axes & Scales 
   */

  var opacityCircles = 0.7,
      maxDistanceFromPoint = 50;

  var color_cicle = d3.scale.ordinal()
    .range(["#2e8bc2", "#209481", "#B6334F"])
    .domain(["water", "carbon", "soil_quality"]);
                 
  // Set the new x axis range
  var xScale = d3.scale.log()
    .range([0, width_circle])
    .domain([
      d3.min(soil_chemistry_data, function (d) { return d.yield * 0.9}), 
      d3.max(soil_chemistry_data, function (d) { return d.yield * 1.1}) 
    ]); 

  // Set new x-axis
  var xAxis = d3.svg.axis()
    .orient("bottom")
    .ticks(2)
    .tickFormat(function (d) {
      return xScale.tickFormat((mobileScreen ? 4 : 8),function(d) { 
        var prefix = d3.formatPrefix(d); 
        return prefix.scale(d) + prefix.symbol;
      })(d);
    })  
    .scale(xScale); 
  
  // Append the x-axis
  wrapper.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + 0 + "," + height + ")")
    .call(xAxis);

  // Set the new y axis range
  var yScale = d3.scale.linear()
    .range([height,0])
    .domain([d3.min(soil_chemistry_data, function(d) { return d.value * 0.9; }), d3.max(soil_chemistry_data, function(d) { return d.value * 1.1; })])
    .nice();  
    

  var yAxis = d3.svg.axis()
    .orient("left")
    .ticks(6)  // Set rough # of ticks
    .scale(yScale); 
      
  // Scale for the bubble size
  var rScale = d3.scale.sqrt()
    .range([mobileScreen ? 1 : 2, mobileScreen ? 10 : 16])
    .domain(d3.extent(soil_chemistry_data, function(d) { return d.yield; }));

  /*
  ** Set-up voronoi
   */

  var voronoi = d3.geom.voronoi()
    .x(function(d) { return xScale(d.yield); })
    .y(function(d) { return yScale(d.value); })
    .clipExtent([[0, 0], [width_circle, height]]);

  var voronoiCells = voronoi(soil_chemistry_data);
    
  /*
  ** Circles to capture close mouse event
   */

  // Create wrapper for the voronoi clip paths
  var clipWrapper = wrapper.append("defs")
    .attr("class", "clipWrapper");

  clipWrapper.selectAll(".clip")
    .data(voronoiCells)
    .enter().append("clipPath")
      .attr("class", "clip")
      .attr("id", function(d) { return "clip-" + d.point.code; })
      .append("path")
      .attr("class", "clip-path-circle")
      .attr("d", function(d) { return "M" + d.join(",") + "Z"; });

  // Initiate a group element for the circles  
  var circleClipGroup = wrapper.append("g")
    .attr("class", "circleClipWrapper"); 
    
  // Place the larger circles to eventually capture the mouse
  var circlesOuter = circleClipGroup.selectAll(".circle-wrapper")
    .data(soil_chemistry_data.sort(function(a,b) { return b.yield > a.yield; }))
    .enter().append("circle")
    .attr("class", function(d,i) { return "circle-wrapper circle-type-" + d.type + " " + d.code + " " + ((d.type != "water")?"hidden":""); })
    .attr("visibility", function(d,i) { 
      if(d.type == 'water'){ return "visible"; } else { return "hidden" } 
    })
    .attr("clip-path", function(d) { return "url(#clip-" + d.code + ")"; })
      .style("clip-path", function(d) { return "url(#clip-" + d.code + ")"; })
    .attr("cx", function(d) {return xScale(d.yield);})
    .attr("cy", function(d) {return yScale(d.value);})
    .attr("r", maxDistanceFromPoint)
    .on("mouseover", showTooltip)
    .on("mouseout",  removeTooltip);

  /*
  ** Scatterplot Circles
   */

  // Initiate a group element for the circles  
  var circleGroup = wrapper.append("g")
    .attr("class", "circleWrapper"); 
    
  // Place the name circles
  circleGroup.selectAll("countries")
    .data(soil_chemistry_data.sort(function(a,b) { return b.yield > a.yield; })) //Sort so the biggest circles are below
    .enter().append("circle")
      .attr("class", function(d,i) { return "countries circle-type-" + d.type + " " + d.code + " " + ((d.type != "water")?"hidden":""); })
      .attr("cx", function(d) {return xScale(d.yield);})
      .attr("cy", function(d) {return yScale(d.value);})
      .attr("r", function(d) {return 5})
      .style("pointer-events", "none")
      .style("opacity", opacityCircles)
      .style("fill", function(d) { return color_cicle(d.type); });
  
  var circleGroupShadow = wrapper.append("g")
    .attr("class", "circleWrapperShadow"); 
    
  // Place the name circles
  circleGroupShadow.selectAll("countries")
    .data(soil_chemistry_data.sort(function(a,b) { return b.yield > a.yield; })) // Sort so the biggest circles are below
    .enter().append("circle")
      .attr("class", function(d,i) { return "countries-shadow circle-type-" + d.type + " " + d.code + " " + ((d.type != "water")?"hidden":""); })
      .attr("cx", function(d) {return xScale(d.yield);})
      .attr("cy", function(d) {return yScale(d.value);})
      .attr("r", function(d) {return 20})
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("fill", function(d) { return color_cicle(d.type); });

  /*
  ** Hover functions of the circles
   */ 

  // Hide the tooltip when the mouse moves away
  function removeTooltip (d, i) {

    $('#circle-tooltip').remove();

    // Save the chosen circle (so not the voronoi)
    var element = d3.selectAll("#chart-circle .countries."+d.code);
      
    // Fade out the bubble again
    element.style("opacity", opacityCircles);
    element.style("fill", function(d) { return color_cicle(d.type); });
      
    var elementShadow = d3.selectAll("#chart-circle .countries-shadow."+d.code);
    elementShadow.style("opacity", 0);
  }

  // Show the tooltip on the hovered over slice
  function showTooltip (d, i) {
    
    var e = [];
    e.clientX = d3.mouse(this)[0];
    e.clientY = d3.mouse(this)[1];

    var cicle_tooltip = '<div id="circle-tooltip" style="left: ' + (e.clientX + 50) + 'px; top: ' + (e.clientY - 20) + 'px;">';
    cicle_tooltip +=    '<span class="soil-chemistry-county"><strong>County</strong></br>' + d.county + '</span>';

    switch(d.type) {
        case 'water':
            cicle_tooltip +=    '<span class="soil-chemistry-water"><strong>Accessible Water</strong></br>' + Number.parseFloat(d.value).toFixed(1) + 'mm</span>';
            break;
        case 'carbon':
            cicle_tooltip +=    '<span class="soil-chemistry-carbon""><strong>Carbon</strong></br>' + Number.parseFloat(d.value).toFixed(1) + '</span>';
            break;
        case 'soil_quality':
            cicle_tooltip +=    '<span class="soil-chemistry-soil"><strong>Soil</strong></br>' + Number.parseFloat(d.value).toFixed(1) + '</span>';
            break;
        default:
    }
    cicle_tooltip +=    '<span class="soil-chemistry-yield"><strong>Corn Yield</strong></br>' + Number.parseFloat(d.yield).toFixed(1) + '</span>';
    cicle_tooltip += '</div>';

    $('#chart-circle-wrapper').append(cicle_tooltip);

    var element = d3.selectAll("#chart-circle .countries."+d.code);
      element.style("fill", function(d) { return color_cicle(d.type); });
      element.style("opacity", 1);

    var elementShadow = d3.selectAll("#chart-circle .countries-shadow."+d.code);
      elementShadow.style("fill", function(d) { return color_cicle(d.type); });
      elementShadow.style("opacity", .3);

            
  } // function showTooltip

} // function drawFinalScatterplot

drawFinalScatterplot();

$('.soil-chemistry-btn').on('click', function(){
  var itm = $(this);
  $('.soil-chemistry-btn').each(function(){
    $(this).removeClass('active');
  });
  itm.addClass('active');
  
  $(".circleClipWrapper circle.circle-wrapper").addClass("hidden");
  $(".circleWrapper circle.countries").addClass("hidden");
  $(".circleWrapperShadow circle.countries-shadow").addClass("hidden");
  
  $(".circleClipWrapper circle.circle-wrapper.circle-type-"+ itm.attr('data-type')).removeClass("hidden");
  $(".circleWrapper circle.countries.circle-type-"+ itm.attr('data-type')).removeClass("hidden");
  $(".circleWrapperShadow circle.countries-shadow.circle-type-"+ itm.attr('data-type')).removeClass("hidden");
});
