"use strict";

var userRoles = require('./routingConfig').userRoles,
    accessLevels = require('./routingConfig').accessLevels;


/** Check authentication level for specific api calls */
function ensureAuthenticated(req, res, next) {
  console.log("ensure authenticated");
  if (!req.isAuthenticated()) return res.send(401);
  return next();
}
function ensureAdmin(req,res,next){
  console.log("ensure admin");
  if (!req.user) return res.send(401);
  if (!(req.user.role & accessLevels.admin)) return res.send(403);
  console.log(req.user.role);
  console.log(accessLevels.admin);
  return next();
}


module.exports = function(app){
  app.all('/api/*',ensureAuthenticated);
  app.get('/api/test', function(req,res){
    res.json({name: "derp"});
  });

  app.all('/api/*',ensureAdmin);
  app.get('/api/testadmin', function(req,res){
    res.json({name: 'only admins can see'});
  });
}