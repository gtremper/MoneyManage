"use strict";

var express = require('express');
var passport = require('passport');
var app = module.exports = express();

app.configure(function(){
  app.use(express.static('app/'));
  app.set('view engine','html');
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({secret: 'You done goofed'}));
  app.use(passport.initialize());
  app.use(passport.session());
});

var userRoles = {
  public: 1, // 001
  user:   2, // 010
  admin:  4  // 100
};
var accessLevels = {
  public: userRoles.public | userRoles.user | userRoles.admin, // 111
  anon:   userRoles.public,                                    // 001
  user:   userRoles.user | userRoles.admin,                    // 110
  admin:  userRoles.admin                                      // 100
};


app.get('/', function(req,res){
  var role = userRoles.public, username = '';
  if (req.user){
    role = req.user.role;
    username = req.user.username;
  }

  res.cookie('user', JSON.stringify({
    'username': username,
    'role': role
  }));

  res.render('index.html');
});

app.get('/views/:filename',function(req,res){
  var filename = req.params.filename;
  if(!filename) return; //should handle this later
  res.render('views/'+filename);
});

// redirect all others to the index (HTML5 history)

/*
app.get('/*', function(req,res){
  var role = userRoles
  res.render('index.html');
});
*/


// JSON api


// Start server

//app.listen(9000,'0.0.0.0');
