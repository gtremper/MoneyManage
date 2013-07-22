"use strict";

var express = require('express');

var app = module.exports = express();

app.configure(function(){
  app.use(express.static('app/'));
  app.set('view engine','html');
  app.use(express.cookieParser());
  app.use(express.bodyParser());
});

app.get('/views/:filename',function(req,res){
  var filename = req.params.filename;
  if(!filename) return; //should handle this later
  res.render('views/'+filename);
});

// redirect all others to the index (HTML5 history)
app.get('/', function(req,res){
  res.render('index.html');
});

// Start server

//app.listen(9000,'0.0.0.0');
