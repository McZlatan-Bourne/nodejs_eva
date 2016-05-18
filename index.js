var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false})

var path = require('path');
var nunjucks = require('nunjucks');
var nunjucksEnv = new nunjucks.Environment( new nunjucks.FileSystemLoader( path.join( __dirname, '/views' ) ));
nunjucksEnv.express( app );

app.get('/', function (req, res) {
    res.render("index.html");
})

app.get('/events', function(req, res) {
  res.render('events.html', {
    title : 'E.V.A rendering with nunjucks',
    events : [
      { name : 'Event #1' },
      { name : 'Event #2' },
      { name : 'Event #3' },
      { name : 'Event #4' },
    ]
  });
});

var server = app.listen(8081, function () {
var host = server.address().address
var port = server.address().port
console.log("E.V.A listening at http://%s:%s", host, port)
})
