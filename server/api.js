"use strict";

var userRoles = require('./routingConfig').userRoles,
    accessLevels = require('./routingConfig').accessLevels;

/** Check authentication level for specific api calls */
function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) return res.send(401);
  return next();
}
function ensureAdmin(req,res,next){
  console.log("ensure admin");
  if (!req.user) return res.send(401);
  if (!(req.user.role & accessLevels.admin)) return res.send(403);
  return next();
}


module.exports = function(app){
  /** Need to be logged in **/
  app.all('/api/*',ensureAuthenticated);

  app.get('/api/get_tables/:id', function(req,res){
    res.json({name: "derp"});
  });

  app.get('/api/table/:id', function(req,res){
    res.json({name: "derp"});
  });

  app.get('/api/table/:id', function(req,res){
    res.json({name: "derp"});
  });

  /** Need to be admin **/
  app.all('/api/*',ensureAdmin);

  app.get('/api/testadmin', function(req,res){
    res.json({name: 'only admins can see'});
  });
}