"use strict";

var userRoles = require('./routingConfig').userRoles,
    accessLevels = require('./routingConfig').accessLevels,
    mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Users = require('./models').Users,
    Transactions = require('./models').Transactions,
    Tables = require('./models').Tables,
    _ = require('underscore'),
    async = require('async');

/** Check authentication level for specific api calls */
function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) return res.send(401,{error: 'need to be logged in'});
  return next();
}
function ensureAdmin(req,res,next){
  console.log("ensure admin");
  if (!req.user) return res.send(401,{error: 'need to be logged in'});
  if (!(req.user.role & accessLevels.admin)) return res.send(403,{error: 'need to be admin'});
  return next();
}


module.exports = function(app){
  /** Need to be logged in **/
  app.all('/api/*',ensureAuthenticated);

  app.get('/api/get_tables', function(req,res){
    var table_ids = _.map(req.user.tables, function(id){return ObjectId(id);});

    Tables
      .where('_id').in(table_ids)
      .exec(function(err,tables){
        if (err) res.send(500,{error:'database error'});
        return res.json(tables);
      });

  });

  /* Body needs "emails" and "title" */
  app.post('/api/add_table',function(req,res){
    var b = req.body;
    new Tables({
      title: b.title,
      members: [],
      transactions: [],
      prevTables: []
    }).save(function(err,table){
      if (err) return res.send(500,{error:'database error'});
      Users
        .where('email')
        .in(b.emails)
        .update({$push: {tables: table._id}})
        .select('_id')
        .exec(function(err, ids){
          if (err) return res.send(500,{error:'database error'});
          Tables.findByIdAndUpdate(table._id, {members: ids}, function(err, tbl){
            if(err) return res.send(500,{error:'database error'});
            return res.json(tbl);
          });
        });
    });
  });

  /* Body needs "email" and "table_id*/
  app.post('/api/add_member/',function(req,res){
    var b = req.body;
    Users
      .findOne({email: b.email})
      .update({$push: {tables: table._id}})
      .select('_id')
      .exec(function(err, id){
        if (err) return res.send(500,{error:'database error'});
        if (!id) return res.send(400,{error:'user not found'});
        Tables.findByIdAndUpdate(b.table_id, {$push: {members: id}}, function(err, tbl){
          if(err) return res.send(500,{error:'database error'});
          return res.json(tbl);
        });
      });
  });

  /** Need to be admin **/
  app.all('/api/*',ensureAdmin);

  app.get('/api/testadmin', function(req,res){
    res.json({name: 'only admins can see'});
  });
}