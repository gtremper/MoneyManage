var express = require('express'),
    http = require('http'),
    routes = require('./server/routes'),
    api = require('./server/api'),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    userRoles = require('./server/routingConfig').userRoles,
    userLevels = require('./server/routingConfig').userLevels;

var app = module.exports = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/app');
app.set('view engine', 'html');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, '.tmp'))); // only for development
app.use(express.cookieParser());
app.use(express.session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

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

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a email and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by email.  If there is no user with the given
      // email, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByEmail(email, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + email }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));

/** Authentication **/
// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "email=bob&password=secret" http://127.0.0.1:3000/login
/*
app.post('/login', 
  passport.authenticate('local'),
  function(req, res) {
    console.log("login");
    res.json(200, {email: 'Bob', role: userRoles.user});
  });
*/  
// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if(err){return next(err);}
    if (!user){return res.send(400);}

    req.login(user, function(err){
      if(err){return next(err);}

      console.log(user);
      console.log(req.body);
      if(req.body.rememberme){
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;//one week
      } else {
        req.session.cookie.maxAge = 1000 * 60 * 60;//one hour
      }
      res.json(200, {'role': user.role, 'email':user.email});
    });

  })(req, res, next);
});

app.post('/logout', function(req, res){
  req.logout();
  res.send(200);
});

/** Routes **/
app.get('/',routes.index);
app.get('/views/:name',routes.views);

/** JSON API **/
require('./server/api')(app);

/** Catch all other routes for angular routing **/
app.get('*',routes.index);

/** Start server **/
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});