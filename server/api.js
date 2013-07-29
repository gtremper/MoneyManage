"use strict";

var userRoles = require('./routingConfig').userRoles,
    accessLevels = require('./routingConfig').accessLevels,
    mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Users = require('./models').Users,
    Transactions = require('./models').Transactions,
    Tables = require('./models').Tables,
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
    Tables
      .where('_id').in(req.user.tables)
      .exec(function(err,tables){
        if (err) res.send(500,{error:'database error'});
        return res.json(tables);
      });
  });

  /* Body needs "emails" and "title" */
  app.post('/api/create_table',function(req,res){
    var b = req.body;
    console.log(b)
    new Tables({
      title: b.title,
      members: [],
      transactions: [],
      prevTables: []
    }).save(function(err,table){
      console.log(table);
      if (err) return res.send(500,{error:'database error'});
      Users
        .where('email').in(b.emails)
        .select('_id')
        .exec(function(err, ids){
          if (err) return res.send(500,err);
          Tables.findByIdAndUpdate(table._id, {members: ids}, function(err, tbl){
            if(err) return res.send(500,{error:'database error'});
            return res.json(tbl);
          });
        });
      Users
        .where('email').in(b.emails)
        .update({$addToSet: {tables: table._id}})
        .exec(function(err){
          if (err) return res.send(500,err);
        });
    });
  });

  /* Body needs "email" and "table_id */
  app.post('/api/add_member',function(req,res){
    var b = req.body;
    Users
      .findOne({email: b.email})
      .select('_id')
      .exec(function(err, id){
        if (err) return res.send(500,{error:'database error'});
        if (!id) return res.send(400,{error:'user not found'});
        Tables.findByIdAndUpdate(b.table_id, {$addToSet: {members: id}}, function(err, tbl){
          if(err) return res.send(500,{error:'database error'});
          return res.json(tbl);
        });
      });
    Users
      .findOne({email: b.email})
      .update({$addToSet: {tables: b.table_id}})
      .exec(function(err){
        if (err) return res.send(500,err);
      });
  });

  /* Body needs "table_id" and "transaction" */
  app.post('/api/add_transaction',function(req,res){
    var b = req.body;
    Tables
      .findById(b.table_id)
      .update({$push: {transactions: b.transaction}})
      .exec(function(err,tbl){
        if (err) return res.send(500,{error:'database error'});
        if (!tbl) return res.send(400,{error:'table not found'});
        res.send(200);
      });
  });

  /* Body needs "table_id" */
  app.post('/api/set_current_table',function(req,res){
    var b = req.body;
    Users.findByIdAndUpdate(req.user._id,{currentTable: b.table_id}, function(err, usr){
      if (err) return res.send(500,{error:'database error'});
      res.json(usr);
    })
  });

  /** Need to be admin **/
  app.all('/api/*',ensureAdmin);

  app.get('/api/testadmin', function(req,res){
    res.json({name: 'only admins can see'});
  });
}