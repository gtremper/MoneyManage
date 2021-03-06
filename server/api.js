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

  app.post('/api/update_account', function(req,res){
    var name = req.body.name || req.user.name;
    var email = req.body.email || req.user.email;
    Users
      .findById(req.user._id)
      .exec(function(err,user){
        if (err) return res.send(500,{error:'database error'});
        user.name = name;
        user.email = email;
        user.save(function(err){
          if (err) return res.send(400,{error:"user already exists"});
          res.json(_.pick(user,'name','role','email','currentTable','_id'));
        });
      });
  });

  app.get('/api/get_tables', function(req,res){
    Tables
      .where('_id').in(req.user.tables)
      .populate('members', 'name email _id')
      .exec(function(err,tables){
        if (err) res.send(500,{error:'database error'});
        return res.json(tables);
      });
  });

  /* Body needs "emails" and "title" */
  app.post('/api/create_table',function(req,res){
    var ids = req.body.ids;
    var title = req.body.title;
    new Tables({
      title: title,
      members: ids,
      transactions: [],
      prevTables: []
    }).save(function(err,table){
      if (err) return res.send(500,{error:'database error'});
      Users.update({_id:{$in: ids}},
        {$addToSet: {tables: table._id}},
        {multi:true},
        function(err,num){
          if (err) return res.send(500,err);
          res.json(table);
        });
    });
  });

  app.post('/api/check_email', function(req,res){
    var email = req.body.email;
    Users.findOne({email: email}, function(err, user){
      if (err) return res.send(500,{error: 'database error'});
      if (user) {
        if (user.password === '!'){
          user.unregistered = true;
        }
        res.json(_.pick(user,'email','name','_id','unregistered'));
      } else {
        /* User doesn't exist. Create Temp user */
        new Users({
          name: email,
          email: email,
          password: '!', //unregistered user
          role: userRoles.user
        }).save(function(err,user){
          if (err) res.send(500,{error: 'database error'});
          user.unregistered = true;
          res.json(_.pick(user,'email','name','_id','unregistered'));
        });
      }
    });
  });

  /* middleware to ensure table ownership */
  function ensureOwnership(req,res,next){
    var id = req.body.table_id;
    Tables.findById(id,function(err,table){
      if (err) return res.send(500,{error: "database error"});
      if (table.members.indexOf(req.user._id) !== -1){
        return next();
      } else {
        return res.send(401, {error:"You don't have access to this document"})
      }
    });
  }

  app.post('/api/edit_table',ensureOwnership, function(req,res){
    var title = req.body.title;
    var table_id = req.body.table_id;
    var member_ids = req.body.member_ids;

    Tables.findByIdAndUpdate(table_id, {members: member_ids, title:title}, {new:false},function(err, table){
      if(err) return res.send(500,{error:'database error'});

      var table_members = _.map(table.members,function(mem){
        return mem.toString();
      });

      var new_members = _.difference(member_ids, table_members);
      var removed = _.difference(table_members, member_ids);


      if (!_.isEmpty(new_members)){
        Users.update({_id:{$in: new_members}},
          {$addToSet: {tables: table_id}},
          {multi:true},
          function(err,num){
            if (err) return res.send(500,err);
          });
      }

      if (!_.isEmpty(removed)){
        Users.update({_id:{$in: removed}},
          {$pull: {tables: table_id}},
          {multi:true},
          function(err,num){
            if (err) return res.send(500,err);
          });
      }
      res.json(table);
    });
  });

  app.post('/api/delete_table',ensureOwnership, function(req,res){
    var table_id = req.body.table_id;
    Tables
      .findById(table_id,
      function(err,table){
        if (err) return res.send(500,{error:'database error'});
        if (!table) return res.send(400,{error:'table not found'});
        Users.update({_id:{$in: table.members}},
          {$pull: {tables: table_id}},
          {multi:true},
          function(err,num){
            if (err) return res.send(500,err);
            res.send(200);
          });

        table.remove(function(err){
          if (err) return res.send(500,{error:'database error'});
        });
      });
  });

  /* Body needs "email" and "table_id */
  app.post('/api/add_member',ensureOwnership, function(req,res){
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
  app.post('/api/add_transaction',ensureOwnership, function(req,res){
    var b = req.body;
    b.transaction.owner = req.user._id;
    Tables
      .findByIdAndUpdate(b.table_id,
      {$push: {transactions: b.transaction}},
      function(err,tbl){
        if (err) return res.send(500,{error:'database error'});
        if (!tbl) return res.send(400,{error:'table not found'});
        res.json(tbl.transactions);
      });
  });

  /* Body needs "table_id" and "transaction" */
  app.post('/api/edit_transaction',ensureOwnership,function(req,res){
    var b = req.body;
    Tables
      .findById(b.table_id,
      function(err,table){
        if (err) return res.send(500,{error:'database error'});
        if (!table) return res.send(400,{error:'table not found'});
        var id = b.transaction._id
        _.extend(table.transactions.id(id), b.transaction);
        table.save(function(err){
          if (err) return res.send(500,{error:'database error'});
          res.json(table.transactions);
        });
      });
  });

  /* Body needs "table_id" and "trans_id" */
  app.post('/api/delete_transaction',ensureOwnership,function(req,res){
    var b = req.body;
    Tables
      .findById(b.table_id,
      function(err,table){
        if (err) return res.send(500,{error:'database error'});
        if (!table) return res.send(400,{error:'table not found'});
        table.transactions.id(b.trans_id).remove();
        table.save(function(err){
          if (err) return res.send(500,{error:'database error'});
          return res.json(table.transactions);
        });
      });
  });

  /* Body needs "table_id" */
  app.post('/api/set_current_table',function(req,res){
    var b = req.body;
    Users.findByIdAndUpdate(req.user._id,{currentTable: b.table_id}, function(err, usr){
      if (err) return res.send(500,{error:'database error'});
      res.send(200);
    })
  });

  /** Need to be admin **/
  app.all('/api/admin/*',ensureAdmin);

}