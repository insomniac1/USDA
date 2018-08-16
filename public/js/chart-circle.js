function drawFinalScatterplot() {
  ////////////////////////////////////////////////////////////
  //////////////////////// Set-up ////////////////////////////
  ////////////////////////////////////////////////////////////

  var mobileScreen = document.getElementById("chart-circle-wrapper").offsetWidth < 550 ? true : false;
  var circle_chart_sp = $('#chart-circle-wrapper');

  //Scatterplot
  var margin = {left: 30, top: 20, right: 20, bottom: 30},
    // width = Math.min( document.getElementById("chart-circle").offsetWidth, 800) - margin.left - margin.right,
    width = circle_chart_sp.width() - margin.left - margin.right,
    height = width*2/3;

  var svg = d3.select("#chart-circle").append("svg")
        .attr("width", (width + margin.left + margin.right))
        .attr("height", (height + margin.top + margin.bottom));
        
  var wrapper = svg.append("g").attr("class", "chordWrapper")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //////////////////////////////////////////////////////
  ///////////// Initialize Axes & Scales ///////////////
  //////////////////////////////////////////////////////

  var opacityCircles = 0.7,
    maxDistanceFromPoint = 50;

  //Set the color for each region
  var color = d3.scale.ordinal()
            .range(["#EFB605", "#E58903", "#E01A25", "#C20049", "#991C71", "#66489F", "#2074A0", "#10A66E", "#7EB852"]);
                 
  //Set the new x axis range
  var xScale = d3.scale.log()
    .range([0, width])
    .domain([100,2e5]); 

  //Set new x-axis
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
  
  //Append the x-axis
  wrapper.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + 0 + "," + height + ")")
    .call(xAxis);


      
  //Set the new y axis range
  var yScale = d3.scale.linear()
    .range([height,0])
    .domain(d3.extent(countries, function(d) { return d.water; }))
    .nice();  

  var yAxis = d3.svg.axis()
    .orient("left")
    .ticks(6)  //Set rough # of ticks
    .scale(yScale); 
      
  //Scale for the bubble size
  var rScale = d3.scale.sqrt()
        .range([mobileScreen ? 1 : 2, mobileScreen ? 10 : 16])
        .domain(d3.extent(countries, function(d) { return d.GDP; }));


  ////////////////////////////////////////////////////////////// 
  //////////////////// Set-up voronoi ////////////////////////// 
  ////////////////////////////////////////////////////////////// 

  var voronoi = d3.geom.voronoi()
    .x(function(d) { return xScale(d.yield); })
    .y(function(d) { return yScale(d.water); })
    .clipExtent([[0, 0], [width, height]]);

  var voronoiCells = voronoi(countries);
    
  ////////////////////////////////////////////////////////////  
  ///////////// Circles to capture close mouse event /////////
  ////////////////////////////////////////////////////////////  

  //Create wrapper for the voronoi clip paths
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

  //Initiate a group element for the circles  
  var circleClipGroup = wrapper.append("g")
    .attr("class", "circleClipWrapper"); 
    
  //Place the larger circles to eventually capture the mouse
  var circlesOuter = circleClipGroup.selectAll(".circle-wrapper")
    .data(countries.sort(function(a,b) { return b.GDP > a.GDP; }))
    .enter().append("circle")
    .attr("class", function(d,i) { return "circle-wrapper " + d.code; })
    .attr("clip-path", function(d) { return "url(#clip-" + d.code + ")"; })
      .style("clip-path", function(d) { return "url(#clip-" + d.code + ")"; })
    .attr("cx", function(d) {return xScale(d.yield);})
    .attr("cy", function(d) {return yScale(d.water);})
    .attr("r", maxDistanceFromPoint)
    .on("mouseover", showTooltip)
    .on("mouseout",  removeTooltip);

  ////////////////////////////////////////////////////////////  
  /////////////////// Scatterplot Circles ////////////////////
  ////////////////////////////////////////////////////////////  

  //Initiate a group element for the circles  
  var circleGroup = wrapper.append("g")
    .attr("class", "circleWrapper"); 
    
  //Place the name circles
  circleGroup.selectAll("countries")
    .data(countries.sort(function(a,b) { return b.GDP > a.GDP; })) //Sort so the biggest circles are below
    .enter().append("circle")
      .attr("class", function(d,i) { return "countries " + d.code; })
      .attr("cx", function(d) {return xScale(d.yield);})
      .attr("cy", function(d) {return yScale(d.water);})
      // .attr("r", function(d) {return rScale(d.GDP);})
      .attr("r", function(d) {return 5})
      .style("pointer-events", "none")
      .style("opacity", opacityCircles)
      .style("fill", function(d) {return '#c6c6c6';}); // .style("fill", function(d) {return color(d.Region);});
  
  var circleGroupShadow = wrapper.append("g")
    .attr("class", "circleWrapperShadow"); 
    
  //Place the name circles
  circleGroupShadow.selectAll("countries")
    .data(countries.sort(function(a,b) { return b.GDP > a.GDP; })) //Sort so the biggest circles are below
    .enter().append("circle")
      .attr("class", function(d,i) { return "countries-shadow " + d.code; })
      .attr("cx", function(d) {return xScale(d.yield);})
      .attr("cy", function(d) {return yScale(d.water);})
      // .attr("r", function(d) {return rScale(d.GDP);})
      .attr("r", function(d) {return 13})
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("fill", function(d) {return '#68B1DF';});


  ///////////////////////////////////////////////////////////////////////////
  /////////////////// Hover functions of the circles ////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  //Hide the tooltip when the mouse moves away
  function removeTooltip (d, i) {

    $('#circle-tooltip').remove();

    //Save the chosen circle (so not the voronoi)
    var element = d3.selectAll("#chart-circle .countries."+d.code);
      
    //Fade out the bubble again
    element.style("opacity", opacityCircles);
    element.style("fill", '#c6c6c6');
      
    var elementShadow = d3.selectAll("#chart-circle .countries-shadow."+d.code);
    elementShadow.style("opacity", 0);
  }

  //Show the tooltip on the hovered over slice
  function showTooltip (d, i) {
    
    var e = [];
    e.clientX = d3.mouse(this)[0];
    e.clientY = d3.mouse(this)[1];

    var cicle_tooltip = '<div id="circle-tooltip" style="left: ' + (e.clientX + 50) + 'px; top: ' + (e.clientY - 20) + 'px;">';
        cicle_tooltip +=    '<span><strong>Accessible Water</strong></br>' + d.water + 'mm</br><strong>Corn Yield</strong></br>' + d.yield + '</span>';
        cicle_tooltip += '</div>';

    $('#chart-circle-wrapper').append(cicle_tooltip);

    var element = d3.selectAll("#chart-circle .countries."+d.code);
      element.style("fill", '#68B1DF');
      element.style("opacity", 1);

    var elementShadow = d3.selectAll("#chart-circle .countries-shadow."+d.code);
      elementShadow.style("fill", '#68B1DF');
      elementShadow.style("opacity", .34);

            
  }//function showTooltip

}//function drawFinalScatterplot

drawFinalScatterplot();

$('.soil-chemistry-btn').on('click', function(){
    var itm = $(this);
    if(itm.hasClass('active')){
      itm.removeClass('active');

      /* TO DO: Add circles groups */
      // if(itm.hasClass('btn-icon--water')) {
      //   d3.selectAll(".series-0").attr("visibility", "hidden");
      // }
      // if(itm.hasClass('btn-icon--carbon')) {
      //   d3.selectAll(".series-1").attr("visibility", "hidden");
      // }
      // if(itm.hasClass('btn-icon--soil')) {
      //   d3.selectAll(".series-2").attr("visibility", "hidden");
      // }
    } else {
      itm.addClass('active');

      /* TO DO: Add circles groups */
      // if(itm.hasClass('btn-icon--water')) {
      //   d3.selectAll(".series-0").attr("visibility", "visible");
      // }
      // if(itm.hasClass('btn-icon--carbon')) {
      //   d3.selectAll(".series-1").attr("visibility", "visible");
      // }
      // if(itm.hasClass('btn-icon--soil')) {
      //   d3.selectAll(".series-2").attr("visibility", "visible");
      // }
    }
});
