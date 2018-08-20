const express = require('express');
const csv = require('csvtojson');
const bodyParser = require('body-parser');
const shell = require('shelljs');
const dataFilePath = './data.csv';

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

app.get('/api/data/', (request, response) => {


  // console.log(request.body.searchCounty);

  countyID = request.query.id;

  csv()
    .fromFile(dataFilePath)
    .then((data) => {

      //sends csv file as array of county objects
      var output = [];

      var requestedData = data.filter(function (n, i) { 
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
            soil_chemistry: []

          };
          output.push(county_itm);
        }
        
        temperature_amount = 0;
        for (k = 0; k < 21; k++) {
          temperature_amount += parseFloat(value["Temperature_" + k]);
        }
        
        vegetation_amount = 0;
        for (k = 0; k < 21; k++) {
          vegetation_amount += parseFloat(value["Vegetation_" + k]);
        }

        var year_itm = {
          yield : value.Yield,
          soil_quality : value.soil_quality,
          carbon : value.carbon,
          water : value.water,
          state : value.State,
          temperature : temperature_amount,
          vegetation: vegetation_amount
          /* cropquality: cropquality */ // TO DO
        };
        
        var soil_chemistry_itm = {};
        
        if (value.Yield) {
          if (value.water) {
            soil_chemistry_itm = {
              yield: value.Yield,
              type: 'water',
              value: value.water,
              code: value.area_symbol
            }
          }
          if (value.soil_quality) {
            soil_chemistry_itm = {
              yield: value.Yield,
              type: 'soil_quality',
              value: value.soil_quality,
              code: value.area_symbol
            }
          }
          if (value.carbon) {
            soil_chemistry_itm = {
              yield: value.Yield,
              type: 'carbon',
              value: value.carbon,
              code: value.area_symbol
            }    
          }
        }
       
        var existing_new = output.filter(function(v, i) {
          return v.area_symbol == value.area_symbol;
        });

        var existingIndex = output.indexOf(existing_new[0]);

        output[existingIndex].years.push({[value.Year]: year_itm});
        output[existingIndex].soil_chemistry.push(soil_chemistry_itm);

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
    pythonPath: '/usr/local/bin/python2.7',
    args: [`-x ${longitude}`,
      `-y ${latitude}`,
      `-q ${soilquality}`,
      `-c ${soilcarbon}`,
      `-w ${wateravailability}`,
      `-d ${date}`,
      `-v`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`, `${vegetation}`,
      `-C`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`, `${cropquality}`,
      `-t`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`, `${temperature}`
    ]
  }
  //Yash said instead of -2 make it the same value the user decides
  PythonShell.run(`${pickledStringPath}`, options, function(err, results) {
    if (err) {
      console.log(err);
      response.send(err);
    }
    response.status(200).send(results);

  });

});

app.listen(port, () => console.log('Listening on localhost:3000'));



console.log('Server listening on port ' + port);
console.log('srcPath is ' + srcPath);
console.log('destPath is ' + destPath);
