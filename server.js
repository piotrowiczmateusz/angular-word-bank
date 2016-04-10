var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/index', function (req, res) {
  res.render('index');
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.get('/config', function (req, res) {
  res.render('config');
});

app.post('/save-config', function (req, res) {
  fs.writeFile("data/config/config.json", JSON.stringify(req.body.data), function() {
    console.log("Config saved.");
  });
});

app.post('/', function (req, res) {
  fs.writeFile("data/words.json", JSON.stringify(req.body.data), function() {
    console.log("Words saved.");
  });
});

app.listen(8888, function () {
  console.log('Server listening on port 8888!');
});
