var bar_zoom_sp = $('#zoom-bar-chart');
var margin = {top: 20, right: 0, bottom: 30, left: 0},
    width_bar = bar_zoom_sp.width() - margin.left - margin.right,
    height_bar = 120 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width_bar], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height_bar, 0]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .tickSize(0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var color = d3.scale.ordinal()
    .range(["#76c6cc", "#e8b251", "#44a484"]);

var svg_bar = d3.select('#zoom-bar-chart').append("svg")
    .attr("width", width_bar + margin.left + margin.right)
    .attr("height", height_bar + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bar_chart = d3.json("/api/bar-data.json", function(error, data) {

    var categoriesNames_bar = data.map(function(d) { return d.categorie; });
    var rateNames = data[0].values.map(function(d) { return d.rate; });

    x0.domain(categoriesNames_bar);
    x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);

    svg_bar.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height_bar + ")")
        .call(xAxis);

    svg_bar.select('.y').transition().duration(500).delay(1300).style('opacity','1');


    

    var slice = svg_bar.selectAll(".slice")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform",function(d) { return "translate(" + x0(d.categorie) + ",0)"; });

    slice.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d.rate); })
            .style("fill", function(d) { return color(d.rate) })
            .attr("y", function(d) { return y(0); })
            .attr("height", function(d) { return height_bar - y(0); })
            .on("mouseover", function(d) {
                // d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
            })
            .attr("rx", 2) 
            .attr("ry", 2)
        .on("mouseout", function(d) {
            // d3.select(this).style("fill", color(d.rate));
        });
    

    slice.selectAll("rect")
        .transition()
        .delay(function (d) {return Math.random()*1000;})
        .duration(1000)
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height_bar - y(d.value); });
        // .attr("d", function(d,i){ 
        //     return rectangleBarRadius(10+40*i,100-d.value,20,d.value,20);
        // });

    // function rectangleBarRadius(x, y, width, height, radius){
    //   return "M" + x + "," + y
    //        + "h" + (width - radius)
    //        + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
    //        + "v" + (height_bar - 2 * radius)
    //        + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
    //        + "h" + (radius - width)
    //        + "z";
    // };
  

    // Add BRUSH 
    var brush = d3.svg.brush()
                  .x(x0)
                  .on("brush", function(){
                          
                          var domain = x0.domain();
                          var domain_rate = width_bar/domain.length;
                          var selected = (brush.empty())?[0, width_bar]:brush.extent();

                          var selected_brush = [
                            domain[Math.floor(selected[0]/domain_rate)],
                            domain[Math.floor(selected[1]/domain_rate)]
                          ];

                          // console.log(selected_brush);

                  });

    svg_bar.append("g")
                    .attr("class", "x brush")
                    .call(brush)
                    .selectAll("rect")
                        .attr("y", 0)
                        .attr("height", height_bar);  

    brush.extent([10, width_bar-10]);
    brush(svg_bar.select(".brush").transition());
    brush.event(svg_bar.select(".brush").transition().delay(1000))


});


