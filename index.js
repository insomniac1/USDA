const express = require('express');
const csv = require('csvtojson');
const fs = require('fs');
const bodyParser = require('body-parser');
const shell = require('shelljs');
var jsonfile = require('jsonfile')

const dataFilePath = './data.csv';

const stateDataFilePath = './public/data_by_state/';

const spawn = require("child_process").spawn;
const pickledStringPath = './yield_model_cli.py';

var PythonShell = require('python-shell');

app = express();

// sass compiler
var sassMiddleware = require('node-sass-middleware');

var srcPath = __dirname + '/sass';
var destPath = __dirname + '/public/styles';

var serveStatic = require('serve-static');
var http = require('http');
var port = process.env.PORT || 3000;

app.use('/styles', sassMiddleware({
  src: srcPath,
  dest: destPath,
  debug: true,
  outputStyle: 'expanded'
}));
// -- end sass compiler

app.use('/',
  serveStatic('./public', {})
);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.set('json spaces', 4);

app.get('/', function(req, res) {
  res.render('pages/home');
});

app.get('/landing', function(req, res) {
  res.render('pages/landing');
});

app.get('/api/map_points_data.js', (request, response) => {
  response.render('api/map_points_data');
});

app.get('/api/gradient-area-data.csv', (request, response) => {
  response.render('api/gradient_area_data');
});

app.get('/api/bar-data.json', (request, response) => {
  response.render('api/bar_data');
});


app.get('/api/map-data/', (request, response) => {

  var state_name = [
      { name: 'ALABAMA'},
      { name: 'ARIZONA'},
      { name: 'ARKANSAS'},
      { name: 'CALIFORNIA'},
      { name: 'COLORADO'},
      { name: 'DELAWARE'},
      { name: 'FLORIDA'},
      { name: 'GEORGIA'},
      { name: 'IDAHO'},
      { name: 'ILLINOIS'},
      { name: 'INDIANA'},
      { name: 'IOWA'},
      { name: 'KANSAS'},
      { name: 'KENTUCKY'},
      { name: 'LOUISIANA'},
      { name: 'MARYLAND'},
      { name: 'MASSACHUSETTS'},
      { name: 'MICHIGAN'},
      { name: 'MINNESOTA'},
      { name: 'MISSISSIPPI'},
      { name: 'MISSOURI'},
      { name: 'MONTANA'},
      { name: 'NEBRASKA'},
      { name: 'NEVADA'},
      { name: 'NEW HAMPSHIRE'},
      { name: 'NEW JERSEY'},
      { name: 'NEW MEXICO'},
      { name: 'NEW YORK'},
      { name: 'NORTH CAROLINA'},
      { name: 'NORTH DAKOTA'},
      { name: 'OHIO'},
      { name: 'OKLAHOMA'},
      { name: 'OREGON'},
      { name: 'PENNSYLVANIA'},
      { name: 'RHODE ISLAND'},
      { name: 'SOUTH CAROLINA'},
      { name: 'SOUTH DAKOTA'},
      { name: 'TENNESSEE'},
      { name: 'TEXAS'},
      { name: 'UTAH'},
      { name: 'VERMONT'},
      { name: 'VIRGINIA'},
      { name: 'WASHINGTON'},
      { name: 'WEST VIRGINIA'},
      { name: 'WISCONSIN'},
      { name: 'WYOMING'}

    ];


  parseusdata = JSON.parse(fs.readFileSync("./public/js/us-data-show.json", "utf8"));
  county_list = parseusdata.county;

  state_name.forEach(function(state_itm_name) {
    csv()
      .fromFile('./public/data_by_state/' + state_itm_name.name + '.csv')
      .then((state_json) => {

          var output = {};
          Object.keys(county_list).map(function(countyKey, index) {
              var county_itm = county_list[countyKey];


              var county_new_itm = {
                      countyID: county_itm.countyID,
                      data: [],
                      yRange: [],
                      name: county_itm.name
                    };
              var county_new_data = {};
              var county_add = false;

              var states_rows = state_json.filter(function(s, z) {
                return s.area_symbol === county_itm.countyID;
              });

              if(states_rows.length > 0){
                states_rows.forEach(function(states_row, j) {


                    county_add = true;

                    /*
                    // for PRODUCTION
                    if(states_row.area_harvested !== '' && states_row.area_harvested !== ' ' && states_row.Yield !== '' && states_row.Yield !== ' ' && states_row.Year !== '' && states_row.Year !== ' '){
                      var year_string = states_row.Year;
                      var  area_harvested = (states_row.area_harvested == '' && states_row.area_harvested == ' ') ? 0 : Number(states_row.area_harvested);
                      var  area_yield = (states_row.Yield == '' && states_row.Yield == ' ') ? 0 : Number(states_row.Yield);
                      var yield_number = area_harvested*area_yield;
                      var yield_number = Number(states_row.area_harvested)*Number(states_row.yield);
                      county_new_data[year_string] = yield_number;
                    }
                    */

                    if(states_row.Yield !== '' && states_row.Yield !== ' ' && states_row.Year !== '' && states_row.Year !== ' '){
                      var year_string = states_row.Year;

                      var yield_number = Number(states_row.area_harvested)*Number(states_row.yield);
                      county_new_data[year_string] = yield_number;
                    }
                });
              }


              if(county_add){
                var min_range = 0;
                var max_range = 0;
                for (var key_new in county_new_data) {
                  if((county_new_data[key_new] < min_range) || (min_range == 0)) min_range = county_new_data[key_new];
                  if(county_new_data[key_new] > max_range) max_range = county_new_data[key_new];
                }

                county_new_itm.yRange = [min_range, max_range];
                county_new_itm.data = county_new_data;

                if(county_new_itm){
                  output[countyKey] = county_new_itm;
                }
              }



          });

          // console.log(output);

          var file = './public/js/us-data-show-empty.json'
          jsonfile.writeFileSync(file, output, {flag: 'a'})

          console.log('VOILA');

        })

      });

  console.log('=  =  =  =  Map Data Works  =  =  =  =  =  ');
  response.send('-  -  -  -  It works  -  -  -  -  -  -  ');
});



app.get('/api/data/', (request, response) => {

  countyID = request.query.id;
  stateName = request.query.state;

  csv()
    .fromFile(stateDataFilePath + stateName + '.csv')
    .then((data) => {

      //sends csv file as array of county objects
      var output = [];

      var requestedData = data.filter(function(n, i) {
        return n.area_symbol === countyID;
      });

      requestedData.forEach(function(value, i) {

        var existing_old = output.filter(function(v, i) {
          return v.area_symbol == value.area_symbol;
        });

        if (!existing_old.length) {
          var county_itm = {
            area_symbol: value.area_symbol,
            years: [],
            soil_chemistry: [],
            bar_map: []

          };
          output.push(county_itm);
        }

        var temperature_amount = 0;
        for (k = 0; k < 21; k++) {
          temperature_amount += parseFloat(value["Temperature_" + k]);
        }

        var vegetation_amount = 0;
        for (k = 0; k < 21; k++) {
          vegetation_amount += parseFloat(value["Vegetation_" + k]);
        }


      var cropquality_amount = 0;
      var  cropquality_excellent = 0;
      var  cropquality_fair = 0;
      var  cropquality_good = 0;
      var  cropquality_poor = 0;
        var cropquality_very_poor = 0;
        for (k = 1; k <= 23; k++) {
          cropquality_excellent += Number(value["% Excellent_" + k]);
          cropquality_fair += Number(value["% Fair_" + k]);
          cropquality_good += Number(value["% Good_" + k]);
          cropquality_poor += Number(value["% Poor_" + k]);
          cropquality_very_poor += Number(value["% Very Poor_" + k]);
        }
        cropquality_amount = cropquality_excellent + cropquality_fair + cropquality_good + cropquality_poor + cropquality_very_poor;

        var year_itm = {
          year: value.Year,
          yield : (value.Yield)?value.Yield:0,
          soil_quality : (value.soil_quality)?Number(value.soil_quality):0,
          carbon : (value.carbon)?Number(value.carbon):0,
          water : (value.water)?Number(value.water):0,
          state : value.State,
          temperature : temperature_amount,
          vegetation: vegetation_amount,
          cropquality: cropquality_amount,
          longitude: value.x_centroid,
          latitude: value.y_centroid
        };

        // var soil_chemistry_itm = {};

        if (value.Yield) {
          if (value.water) {
            var soil_chemistry_itm_water = {
              county: (value.county_name)?value.county_name:'',
              yield: (value.Yield)?value.Yield:0,
              type: 'water',
              value: (value.water)?value.water:0,
              code: value.area_symbol + '-water-' + Number(value.Yield.toString().replace('.', ''))
            }
          }
          if (value.soil_quality) {
            var soil_chemistry_itm_soil = {
              county: (value.county_name)?value.county_name:'',
              yield: (value.Yield)?value.Yield:0,
              type: 'soil_quality',
              value: (value.soil_quality)?Number(value.soil_quality):0,
              code: value.area_symbol + '-soil_quality-' + Number(value.Yield.toString().replace('.', ''))
            }
          }
          if (value.carbon) {
            var soil_chemistry_itm_carbon = {
              county: (value.county_name)?value.county_name:'',
              yield: (value.Yield)?value.Yield:0,
              type: 'carbon',
              value: (value.carbon)?Number(value.carbon):0,
              code: value.area_symbol + '-carbon-' + Number(value.Yield.toString().replace('.', ''))
            }
          }
        }

        var map_bar_itm = {
          year: value.Year,
          values: [
            {
              value: (value.Yield)?Number(value.Yield):0,
              rate: 'Yield'
            },
            {
              value: (value.area_harvested)?Number(value.area_harvested):0,
              rate: 'Acres'
            },
            {
              // value: ((value.Yield)?Number(value.Yield):0) * ((value.area_harvested)?Number(value.area_harvested):0),
              value: ((value.Yield)?Number(value.Yield):0) * ((value.area_harvested)?Number(value.area_harvested):0) / 100,
              rate: 'Production'
            }
          ]
        };

        var existing_new = output.filter(function(v, i) {
          return v.area_symbol == value.area_symbol;
        });

        var existingIndex = output.indexOf(existing_new[0]);

        output[existingIndex].years.push(year_itm);
        if(soil_chemistry_itm_water){
          output[existingIndex].soil_chemistry.push(soil_chemistry_itm_water);
        }
        if(soil_chemistry_itm_soil){
          output[existingIndex].soil_chemistry.push(soil_chemistry_itm_soil);
        }
        if(soil_chemistry_itm_carbon){
          output[existingIndex].soil_chemistry.push(soil_chemistry_itm_carbon);
        }
        output[existingIndex].bar_map.push(map_bar_itm);

      });

      response.send(output);

    });

});

app.post('/api/updateData', (request, response) => {

  const {
    longitude,
    latitude,
    soilquality,
    soilcarbon,
    wateravailability,
    date,
    cropquality,
    vegetation,
    temperature
  } = request.body;

  console.log(longitude, latitude, soilquality, soilcarbon, wateravailability, date, cropquality, vegetation, temperature);
  const options = {
    pythonPath: '/usr/local/bin/python3.7',
    args: [`-x ${longitude}`,
       `-y ${latitude}`,
       `-q ${soilquality}`,
       `-c ${soilcarbon}`,
       `-w ${wateravailability}`,
       `-d ${date}`,
       `-C`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`,
        `-v`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`,
       `-t`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`
     ],
    
  }
  // Yash said instead of -2 make it the same value the user decides
  PythonShell.run(`${pickledStringPath}`, options, function(err, results) {
    console.log(results);
    if (err) {
      console.log(err);
      response.send(err);
    }
      var results = results + " Bushels Per Acre";
    response.status(200).send(results);

  });

  // response.status(200).send('179.2135');

});

app.listen(port, () => console.log('Listening on localhost:3000'));



console.log('Server listening on port ' + port);
console.log('srcPath is ' + srcPath);
console.log('destPath is ' + destPath);
