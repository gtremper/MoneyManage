var userRoles = require('./routingConfig.js').userRoles;

/** Index and views **/

exports.index = function(req,res){
  var role = userRoles.public, email = '';
  if(req.user){
    role = req.user.role;
    email = req.user.email;
  }
  res.cookie('user', JSON.stringify({
    'email' : email,
    'role' : role
  }));
  res.sendfile('./app/indexx.html');
};

exports.views = function(req,res){
  var name = req.params.name;
  res.sendfile('views/'+name);
};
