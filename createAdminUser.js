#!/usr/bin/env node

// This can be deleted once the admin user for the app has been created
// for security reasons
// COMMAND: " EVA_ADMIN_PASS='<n3wadm1nP@55worD>' node createAdminUser.js"

var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = process.env.EVA_ADMIN_PASS;

const MongoClient = require("mongodb").MongoClient
var db
var db_username = process.env.NODEJS_EVA_DB_USERNAME
var db_password = process.env.NODEJS_EVA_DB_PASSWORD
var db_url = "mongodb://" + db_username + ":" + db_password + "@ds011873.mlab.com:11873/nodejs_eva"


MongoClient.connect(db_url, (err, database) => {
  if (err) return console.log(err)
  db = database

  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(myPlaintextPassword, salt);
  
  var item = {
      username: "admin",
      password: hash
  }  
  db.collection('users').insertOne(item, function(err, results) {
      if (err) return console.log(err)
          console.log("Admin user created successfully")
          db.close();
  })
})

