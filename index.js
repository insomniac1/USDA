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

app.get('/api/data', (request, response) => {
  csv()
    .fromFile(dataFilePath)
    .then((data) => {
      //sends csv file as array of county objects
      response.send(data);
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
    pythonPath: '/usr/local/bin/python3',
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
