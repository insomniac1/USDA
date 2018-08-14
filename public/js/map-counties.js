var width = 960,
    height = 500,
    centered;

var projection = d3.geo.albersUsa()
    .scale(1070)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg_map = d3.select("#map-counties").append("svg")
    .attr("width", width)
    .attr("height", height);

// Define linear scale for output
var color = d3.scale.linear()
  .range(["#20906A","#3FA885","#64C2A2", "#8EDAC1", "#A5E7D1", "#DBAB58", "#E9BF77", "#F2CC89", "#F7E2BC", "#FBF0DE"]);

svg_map.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

var g = svg_map.append("g");

d3.json("/js/us.json", function(error, us) {

  color.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]); // setting the range of the input data

  g.append("g")
    .attr("id", "counties")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .enter().append("path")
      .attr("d", path)
      .attr("class", "county-boundary")
    .on("click", countyclicked);

  g.append("g")
    .attr("id", "states")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
      .attr("d", path)
      .attr("class", "state")
      .on("click", clicked)
      .style("fill", function(d) {
        return color(d.id);
      });

});


function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(70)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}

function countyclicked(d) {
  console.log(d.id);
  
  x = width / 2;
  y = height / 2;
  k = 1;
  centered = null;


  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(70)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}