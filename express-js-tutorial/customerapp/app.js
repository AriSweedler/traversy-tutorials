var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

//statically import. Check to see if these work after we have some more stuff.
//import * as express from 'express';
//import * as body-parser from 'body-parser';
//import * as path from 'path';

var app = express();

app.get('/', (req, res) => {
  res.send("hello, world");
});


app.listen(3000, function () {
  console.log("Server started on port 3000.");
})