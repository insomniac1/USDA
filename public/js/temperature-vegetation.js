import { createGradient } from './functions';
export function drawTemperatureVegetation(data) {
    
    $('#chart-gradient').html('');


    var area_ContainerID = "#chart-gradient";
    var area_chart_sp = $('.gradient-wrapper');
    var margin = {top: 0, right: 0, bottom: 30, left: 0},
        width_area  = area_chart_sp.width() - margin.left - margin.right,
        height_area = width_area * 0.6  - margin.top  - margin.bottom;

    let mobile_area = false;
    if (width_area <= 500) {
      mobile_area = true;
    }

    var seriesLabels = {
      'yield':'Corn Yield',
      'temperature':'Temperature',
      'vegetation':'Vegetation'
    };

    // Add scale for x
    var x_area = d3.scale.ordinal()
      .rangeRoundBands([0, width_area], -1.1);

    if(mobile_area) {
      var x_ticks = d3.scale.ordinal()
        .rangeRoundBands([0, width_area], 0);
    } else {
      var x_ticks = d3.scale.ordinal()
        .rangeRoundBands([0, width_area], -0.7);
    }

    // Add scale for y
    var y_area = d3.scale.linear()
      .rangeRound([height_area, 0]);

    // Add x axis
    var xAxis_area = d3.svg.axis()
      // .scale(x_area)
      .scale(x_ticks)
      .orient("bottom")
      .tickPadding(12)
      .tickSize(1)
      .tickFormat(function (d) {
        if(mobile_area){
          if(d % 3 == 0) return d;
        } else {
          return d;
        }

      });

    if(mobile_area){
      xAxis_area.ticks(1000);
    }

    // Creating Y axis background lines
    var yAxis_border = d3.svg.axis()
      .scale(y_area)
      .orient("left")
      .innerTickSize(-width_area)
      .outerTickSize(0)
      .tickPadding(10)
      .ticks(5)
      .tickFormat(function (d) {
        return '';
      });

    // Create area border
    var area_border = d3.svg.line()
        .x(function(d, i) { return x_area(d.year); })
        .y(function(d) { return y_area(d.value); });

    // Add colors according to the design
    var color_area = d3.scale.ordinal()
      .range(["#2D9280", "#5BABB1",  "#E5B156"])
      .domain(["yield", "temperature", "vegetation"]);

    // Add SVG for the area chart to the relevant container (/views/pages/landing.js)
    var svg_area = d3.select(area_ContainerID).append("svg")
        .attr("width",  width_area + margin.left + margin.right)
        .attr("height", height_area + margin.top  + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /*
    ** Output for 'd': {name: "yield", values: Array(..)}; {name: "temperature", values: Array(..)}; {name: "vegetation", values: Array(..)}
    ** 'd.values': values:Array(..)
    **               0:{name: "yield", year: 2000, value: 100, y0: 0, y: 100}
    **               1:{name: "yield", year: 2001, value: 847, y0: 0, y: 847}..
     */
    var stack = d3.layout.stack()
      .values(function (d) { return d.values; })
      .x(function (d) { return x_area(d.year) + x_area.rangeBand() / 2; })
      .y(function (d) { return d.value; });

    // console.log(x_area.rangeBand([0, width_area]));

    var area = d3.svg.area()
      .x(function (d) { return x_area(d.year) + x_area.rangeBand() / 2; })
      .y0(function (d) { return y_area(0); })
      .y1(function (d) { return y_area(d.y); })

    /* Reading data from the csv
    ** Output for 'data':
    **  [{…}, {…}, ..]:
    **    0:{year: "2000", yield: "100", temperature: "700", vegetation: "100"}
    **    1:{year: "2001", yield: "847", temperature: "388", vegetation: "100"} ..
     */


    margin = {top: 0, right: 0, bottom: 30, left: 0};

    var labelVar = 'year';

    var varNames = ["yield", "temperature", "vegetation"];

    /*
    ** Output for 'color_area.domain()': (3) ["yield", "temperature", "vegetation"]
     */
    color_area.domain(varNames);

    /*
    ** Output for 'seriesArr': (3) [{…}, {…}, {…}]
    **                              0:{name: "yield", values: Array(..)}
    **                              1:{name: "temperature", values: Array(..)}
    **                              2:{name: "vegetation", values: Array(..)}
     */
    var seriesArr = [], series = {};
    varNames.forEach(function (name) {
      series[name] = {name: name, values:[]};
      seriesArr.push(series[name]);
    });


    /*
    ** Output for 'series': {{yield: {…}, temperature: {…}, vegetation: {…}}
     */
    data.forEach(function (d, i) {
      d.years.forEach(function(year_itm) {
        varNames.map(function (name) {
          series[name].values.push({name: name, year: parseInt(year_itm[labelVar]), value: + year_itm[name]});
        })
      })
    });


    /*
    ** Output for 'x_area.domain()': (..) [2000, 2001, 2002, 2003, ..]
     */
    data.forEach(function (d, i) {
      x_area.domain(d.years.map(function (year_itm) {
        return parseInt(year_itm[labelVar]);
      }));

      x_ticks.domain(d.years.map(function (year_itm) {
        return parseInt(year_itm[labelVar]);
      }));
    });


    stack(seriesArr);

    // Define max value in order to scale y axis
    y_area.domain([0, d3.max(seriesArr, function (c) {
      return d3.max(c.values, function (d) { return d.y + d.y * 0.1});
    })]);

    // Create g element for Y axis background lines
    svg_area.append("g")
      .attr("class", "y axis")
      .call(yAxis_border)

    // Create g element for X axis labels (in our case: 2000, 2001, 2002, ..)
    svg_area.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height_area + ")")
      .call(xAxis_area)

    //Add relevant classes to each series data
    var selection = svg_area.selectAll(".series")
      .data(seriesArr)
      .enter().append("g")
      .attr("class", function(d, i) { return "series series-" + i; })

    /*
    ** Fill each area with the relevant color
     */

    // 1. Create gradients
    var gradient_svg = $(area_ContainerID).find('svg')[0];
    createGradient(gradient_svg,'temperature-gradient-0',[ // Create gradient
        { offset: '0%', 'stop-color': '#44A484 ', 'stop-opacity': '0.45' },
        { offset: '75%', 'stop-color': '#44A484', 'stop-opacity': '0.05' }
    ]);
    createGradient(gradient_svg,'temperature-gradient-1',[ // Create gradient
        { offset: '0%', 'stop-color': '#76C6CC','stop-opacity': '0.45' },
        { offset: '75%', 'stop-color': '#76C6CC', 'stop-opacity': '0.05' }
    ]);
    createGradient(gradient_svg,'temperature-gradient-2',[ // Create gradient
        { offset: '0%', 'stop-color': '#E8B251 ', 'stop-opacity': '0.45' },
        { offset: '75%', 'stop-color': '#E8B251', 'stop-opacity': '0.05' }
    ]);
    // 2. Fill chart area
    selection.append("path")
      .attr("d", function (d) { return area(d.values); })
      .attr("class", "streamPath")
      .style('fill', function(d, i) {
        return 'url(#temperature-gradient-' + i + ')';
      })


    /*
    ** Points for Tooltips
    */


    // Visible points
    var points = svg_area.selectAll(".seriesPoints")
      .data(seriesArr)
      .enter().append("g")
        .attr("class", "seriesPoints");

    points.selectAll(".point")
      .data(function (d) { return d.values; })
      .enter().append("circle")
       .attr("class", function (d, i) { return "point point-itm-"  + d.name + '-' + i; })
       .attr("cx", function (d) {
          return x_area(d.year) + x_area.rangeBand() / 2;
        })
       .attr("cy", function (d) { return y_area(d.y); })
       .attr("r", "5px")
       .style("opacity", 0)
       .style("fill",function (d) { return color_area(d.name); });



    // Hidden points
    var points_hover = svg_area.selectAll(".seriesPointsHover")
      .data(seriesArr)
      .enter().append("g")
        .attr("class", function(d, i){ return "seriesPointsHover seriesPointsHover-"+i; });

    if((data[0].years.length != 1) && (data[0].years[0].state != "")){
      points_hover.selectAll(".point-hover")
        .data(function (d) { return d.values; })
        .enter().append("circle")
         .attr("class", "point-hover")
         .attr("cx", function (d) {
            return x_area(d.year) + x_area.rangeBand() / 2;
          })
         .attr("cy", function (d) { return y_area(d.y); })
         .attr("r", "25px")
         .style("opacity", 0)
         .style("fill",function (d) { return color_area(d.name); })
         .on("mouseover", function (d, i) { showPopover.call(this, d, i); })
         .on("mouseout",  function (d, i) { removePopovers.call(this, d, i); })
    }

    /*
    ** Going through series array and adding top border line
    ** Line styles are described in _section.scss:294-307
     */
    seriesArr.forEach(function(d, i) {
      svg_area.select(".series-" + i)
        .append("path")
        .data([seriesArr[i].values])
        .attr("class", "border-line line" + i)
        .attr("d", area_border)
        .attr("transform", "translate(" + x_area.rangeBand() / 2 + ", 0)")
    });

    function removePopovers (d, i) {
      $('.point-itm-' + d.name + '-' + i).css('opacity', 0);
      $('#area-tooltip').remove();
    }

    function showPopover (d, i) {
      var e = [];
      e.clientX = d3.mouse(this)[0];
      e.clientY = d3.mouse(this)[1];

      var area_tooltip = '<div id="area-tooltip" style="left: ' + (e.clientX + 25) + 'px; top: ' + (e.clientY - 50) + 'px;">';
          area_tooltip +=    '<span><strong>' + seriesLabels[d.name] + '</strong></br>' + d.value + '</span>';
          area_tooltip +=    '<span><strong>Year</strong></br>' + d.year + '</span>';
          area_tooltip += '</div>';

      $('.point-itm-' + d.name + '-' + i).css('opacity', 1);

      $('#chart-gradient').append(area_tooltip);
    }
}

$('.temp-veget-btn').on('click', function(){
    var itm = $(this);
    if(itm.hasClass('active')){
      itm.removeClass('active');

      if(itm.hasClass('btn-icon--corn')) {
        d3.selectAll(".series-0").attr("visibility", "hidden");
        $(".seriesPointsHover-0").css("display", "none");
      }
      if(itm.hasClass('btn-icon--temperature')) {
        d3.selectAll(".series-1").attr("visibility", "hidden");
        $(".seriesPointsHover-1").css("display", "none");
      }
      if(itm.hasClass('btn-icon--vegetation')) {
        d3.selectAll(".series-2").attr("visibility", "hidden");
        $(".seriesPointsHover-2").css("display", "none");
      }
    } else {
      itm.addClass('active');
      if(itm.hasClass('btn-icon--corn')) {
        d3.selectAll(".series-0").attr("visibility", "visible");
        $(".seriesPointsHover-0").css("display", "initial");
      }
      if(itm.hasClass('btn-icon--temperature')) {
        d3.selectAll(".series-1").attr("visibility", "visible");
        $(".seriesPointsHover-1").css("display", "initial");
      }
      if(itm.hasClass('btn-icon--vegetation')) {
        d3.selectAll(".series-2").attr("visibility", "visible");
        $(".seriesPointsHover-2").css("display", "initial");
      }
    }
});
