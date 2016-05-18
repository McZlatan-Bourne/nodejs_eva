var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false})


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
})

var server = app.listen(8081, function () {
var host = server.address().address
var port = server.address().port
console.log("E.V.A listening at http://%s:%s", host, port)
})
