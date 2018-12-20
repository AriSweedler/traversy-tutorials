var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);


//statically import. Check to see if these work after we have some more stuff.
// import * as express from 'express';
//import * as body-parser from 'body-parser';
//import * as path from 'path';

var app = express();

//my own handmade middleware
// var logger = (req, res, next) => {
//   console.log("Logging...");
//   next();
// }
// app.use(logger);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// bodyParser middleware – we need these functions to during each page load
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static path (for stuff like .css files)
app.use(express.static(path.join(__dirname, 'public')));

// Global variables
app.use((req, res, next) => {
  res.locals.errors = null;
  next();
})


// Express-validator middleware, to make sure we don't get gobbledy-gook from users
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.get('/', (req, res) => {
  db.users.find((err, docs) => {
    res.render('index', {
      name: "Boss",
      users: docs
      });
  });
});

app.post('/users/add', (req, res) => {

  req.checkBody('first_name', 'First name is required').notEmpty();
  req.checkBody('last_name', 'Last name is required').notEmpty();
  req.checkBody('age', 'Age is required').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    db.users.find((err, docs) => {
      res.render('index', {
        name: "Boss",
        users: docs,
        errors: errors
      });
    });
  } else {
    var newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      age: req.body.age
    }
    db.users.insert(newUser, (err, result) => {
      if (err) {
        console.log("Database insert error");
      } else {
        // console.log("new user successfully added");
      }
    });
    res.redirect('/');
  }
});


app.delete('/users/delete/:id', (req, res) => {
  const obj = {_id: mongojs.ObjectId(req.params.id)};
  console.log(`\tDeleting: '${req.params.id}'`);
  db.users.remove(obj, (err) => {
    if (err) {
      console.log("Database delete error");
    }
  });
})

app.listen(3000, function () {
  console.log("Server started on port 3000.");
  console.log("\tMake sure your mongo database is running! 'Run `npm run-script mongo`");
})