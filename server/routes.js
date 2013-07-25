var userRoles = require('./routingConfig');

/** Index and views **/

exports.index = function(req,res){
  var role = userRoles.public, username = '';
  if(req.user){
    role = req.user.role;
    username = req.user.username;
  }
  res.cookie('user', JSON.stringify({
    'username' : username,
    'role' : role
  }));


  console.log('username');
  console.log(username);
  console.log('role');
  console.log(role);
  res.sendfile('./app/indexx.html');
};

exports.views = function(req,res){
  var name = req.params.name;
  res.sendfile('views/'+name);
};
