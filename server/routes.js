var userRoles = require('./routingConfig.js').userRoles;

/** Index and views **/

exports.index = function(req,res){
  var role = userRoles.public, email = '', name='', _id=0, currentTable=0;
  if(req.user){
    name = req.user.name;
    role = req.user.role;
    email = req.user.email;
    currentTable = req.user.currentTable;
    _id = req.user._id;
  }
  res.cookie('user', JSON.stringify({
    'currentTable' : currentTable,
    'name' : name,
    'email' : email,
    'role' : role,
    '_id' : _id
  }));
  res.sendfile('./app/indexx.html');
};

exports.views = function(req,res){
  var name = req.params.name;
  res.sendfile('views/'+name);
};
