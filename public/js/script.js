$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/057b672172ccc6c08fe7dbb27fc17ebca3f5b770/samples/data/us-counties-unemployment.json', function (data) {

    var countiesMap = Highcharts.geojson(Highcharts.maps['countries/us/us-all-all']),
        // Extract the line paths from the GeoJSON
        lines = Highcharts.geojson(Highcharts.maps['countries/us/us-all-all'], 'mapline'),
        // Filter out the state borders and separator lines, we want these in separate series
        borderLines = Highcharts.grep(lines, function (l) {
            return l.properties['hc-group'] === '__border_lines__';
        }),
        separatorLines = Highcharts.grep(lines, function (l) {
            return l.properties['hc-group'] === '__separator_lines__';
        });

    // Add state acronym for tooltip
    Highcharts.each(countiesMap, function (mapPoint) {
        mapPoint.name = mapPoint.name + ', ' + mapPoint.properties['hc-key'].substr(3, 2);
    });

    // Create the map
    Highcharts.mapChart('main_map', {
        chart: {
            borderWidth: 1,
            marginRight: 20 // for the legend
        },

        title: {
            text: 'US Counties unemployment rates, April 2015'
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)'
        },

        mapNavigation: {
            enabled: true
        },

        colorAxis: {
            min: 0,
            max: 25,
            tickInterval: 5,
            stops: [[0, '#F1EEF6'], [0.65, '#900037'], [1, '#500007']],
            labels: {
                format: '{value}%'
            }
        },

        plotOptions: {
            mapline: {
                showInLegend: false,
                enableMouseTracking: false
            }
        },

        series: [{
            mapData: countiesMap,
            data: data,
            joinBy: ['hc-key', 'code'],
            name: 'Unemployment rate',
            tooltip: {
                valueSuffix: '%'
            },
            borderWidth: 0.5,
            states: {
                hover: {
                    color: '#a4edba'
                }
            }
        }, {
            type: 'mapline',
            name: 'State borders',
            data: borderLines,
            color: 'white'
        }, {
            type: 'mapline',
            name: 'Separator',
            data: separatorLines,
            color: 'gray'
        }]
    });
});