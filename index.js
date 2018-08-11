const express = require('express');
const csv = require('csvtojson');
const bodyParser = require('body-parser');
const shell = require('shelljs');
const spawn = require('child_process').spawn;

const dataFilePath = './data.csv';

app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/home');
});

app.get('/landing', function(req, res) {
  res.render('pages/landing');
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

  //THe below is an example of how to run a python program from express using
  // Node's child process

  // const spawn = require("child_process").spawn;
  // const pythonProcess = spawn('python',["path/to/script.py", arg1, arg2, ...]);
  response.send('your data was received');

});

app.listen(3000, () => console.log('logged in') );
