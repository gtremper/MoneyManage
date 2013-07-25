var mongoose = require('mongoose'),
    userRoles = require('./routingConfig').userRoles;

mongoose.connect('mongodb://localhost/test');

var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: Number
});

exports.Users = mongoose.model('Users',UserSchema);

/** Passport configuration **/
var users = [
    { id: 1, password: '123', email: 'user', role: userRoles.user}
  , { id: 2, password: '123', email: 'admin', role: userRoles.admin }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByEmail(email, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.email === email) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}