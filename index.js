var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser());
var urlencodedParser = bodyParser.urlencoded({extended:false})

var path = require("path");
var assert = require("assert");

var nunjucks = require("nunjucks");
var nunjucksEnv = new nunjucks.Environment( new nunjucks.FileSystemLoader( path.join( __dirname, "/views" ) ));
nunjucksEnv.express( app );

const MongoClient = require("mongodb").MongoClient
var db
MongoClient.connect("mongodb://mczlatan_bourne:nodejs_eva123@ds011873.mlab.com:11873/nodejs_eva", (err, database) => {
  assert.equal(null, err);
  //if (err) return console.log(err)
  db = database
})


app.get("/", function (req, res) {
    res.render("index.html");
})

app.get("/upload-event", function (req, res) {
    res.render("upload.html");
})

app.post('/upload-event', (req, res) => {
  var item = {
    event_name: req.body.event_name,
    event_address: req.body.event_address
  }  
  db.collection('events').insertOne(item, function(err, results) {
    //if (err) return console.log(err)
    assert.equal(null, err);
    db.close();
  })
  res.redirect("/");
})

app.get("/events", function(req, res) {
  db.collection('events').find().toArray((err, result) => {
    assert.equal(null, err);
    //if (err) return console.log(err)
    var title = "Event Listing"
    res.render('events.html', {events: result, title})
  })
});


var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("E.V.A listening at http://%s:%s", host, port)
})
