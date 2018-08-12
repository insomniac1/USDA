const express = require('express');
const csv = require('csvtojson');
const bodyParser = require('body-parser');
const shell = require('shelljs');
const spawn = require('child_process').spawn;
const dataFilePath = './data.csv';

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.render('pages/home');
});

app.get('/landing', function(req, res) {
  res.render('pages/landing');
});

app.get('/api/map_points_data.js',(request,response) => {
  response.render('api/map_points_data');
});

app.get('/api/data',(request,response) => {
  csv()
  .fromFile(dataFilePath)
  .then((data) => {
     //sends csv file as array of county objects
     response.send(data);
  });
});

app.post('/api/updateData', (request, response) => {
  console.log(request.body);

  shell.mkdir(`./${request.body.soilcondition}`);

  //Next steps
  // 1: Define what data is needed to feed to python script
  // 2: send data to this endpoint via ajax POST request
  // 3: Use data to run python script w/ paramaters from request.
  // 4: await result of python script and send result back
  // 5: update graphs/visualizations w/ new data

  // The below is an example of how to run a python program from express using
  // Node's child process

  // const spawn = require("child_process").spawn;
  // const pythonProcess = spawn('python',["path/to/script.py", arg1, arg2, ...]);
  response.send('your data was received');
});

app.listen(port, () => console.log('Listening on localhost:3000') );
console.log('Server listening on port ' + port);
console.log('srcPath is ' + srcPath);
console.log('destPath is ' + destPath);
