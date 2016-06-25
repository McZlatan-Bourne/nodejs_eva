#!/usr/bin/env node

var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var nunjucks = require("nunjucks");
var gravatar = require("nodejs-gravatar");
var mongoose = require("mongoose");
var sessions = require("client-sessions");
var bcrypt = require("bcryptjs");
var csrf = require("csurf")

var app = express();
app.use(bodyParser.urlencoded({extended:true}));

var nunjucksEnv = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.join(__dirname, "/views")));
nunjucksEnv.express(app);

app.use(sessions({
  secret: "34qqfgqpeuhq4y34758tpqheaabjnsfk",
  cookieName: "session",
  duration: 30*60*1000,
  activeDuration: 5*60*1000,
  httpOnly: true,
  ephemeral: true
}));

app.use(csrf())

mongoose.connect("mongodb://mczlatan:123456@ds011873.mlab.com:11873/nodejs_eva")
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId

var User = mongoose.model("User", new Schema({
  id: ObjectId,
  username: String,
  email: {type: String, unique: true},
  password: String
  }));

var Event = mongoose.model("Event", new Schema({
  id: ObjectId,
  event_name: {type: String, unique: true},
  org_email: String,
  event_address: String
  }));

app.use(function(req, res, next){
  if (req.session && req.session.user) {
    User.findOne({email: req.session.user.email}, function(err, user){
      if (user) {
        req.user = user;
        delete req.user.password;
        req.session.user = req.user;
        res.locals.user = req.user;
      }
      next();
    })
  }
  else{
    next();
  }
});

function requireLogin(req, res, next) {
    if (!req.user) {
      res.redirect("/login")
    }
    else{
      next();
    }
  }

app.get("/", function (req, res) {
    res.render("index.html");
});

app.get("/upload-event", requireLogin, function (req, res) {
    res.render("upload.html", {csrfToken: req.csrfToken()});
});

app.post("/upload-event", requireLogin, function (req, res) {
    var event = new Event({
      event_name: req.body.event_name,
      org_email: req.body.org_email,
      event_address: req.body.event_address
    })
    event.save(function(err){
      if(err){
        var error = "UPLOAD FAILED: couldnt save event data";
        if(err.code === 11000) {
          var error = "Event name taken"
        }
        res.render('upload.html', {error})
      }
      else{
        res.redirect("/events");
      }
    })
  });

app.get("/register", function (req, res) {
    res.render("register.html", {csrfToken: req.csrfToken()});
});

app.post("/register", function (req, res) {
    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    var user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash
    })
    user.save(function(err){
      if(err){
        var error = "REGISTERATION FAILED: couldnt save event data";
        if(err.code === 11000) {
          var error = "Username or email has been taken by another user"
        }
        res.render('register.html', {error});
      }
      else{
        var msg = "Registeration Successful"
        res.redirect("/login");
      }
    })
  });

app.get("/login", function (req, res) {
    res.render("login.html", {csrfToken: req.csrfToken()});
});

app.post("/login", function (req, res) {
    User.findOne({email: req.body.email}, function(err, user){
      if (!user) {
        res.render("login.html", {error:"Invalid email or password"});
      }
      else{
        if (bcrypt.compareSync(req.body.password, user.password)){
            req.session.user = user;
            res.redirect("/dashboard")
          }
        else{
          res.render("login.html", {error:"Invalid email or password"});
        }
      }
    })
  });

app.get("/dashboard", requireLogin, function (req, res) {
  res.render("dashboard.html");  
});


app.get("/logout", function (req, res) {
    req.session.reset();
    res.redirect("/");
});

app.get("/events", function(req, res) {
    Event.find(function(err, events) {
    if (err){
      res.render('events.html', {err})
    }
    else{
      dAvatar = gravatar.imageUrl('example@gmail.com' ,  {s: '100', r: 'w', d: 'mm'}, true)
      res.render('events.html', {events, dAvatar})
    }
  })
});

var server = app.listen(process.env.PORT || 8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("E.V.A listening at http://%s:%s", host, port)
})
