var express = require('express'),
    routes = require('./server/routes'),
    api = require('./server/api'),
    path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    userRoles = require('./server/routingConfig').userRoles,
    userLevels = require('./server/routingConfig').userLevels,
    mongoose = require('mongoose'),
    Users = require('./server/models').Users;

var app = module.exports = express();


// all environments
app.configure(function(){
  app.set('port', process.env.PORT || 8000);
  app.use(express.compress());
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
})

/** Passport configuration **/

//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  Users.findOne({_id:id}, function (err, user) {
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
      Users.findOne({'email':email}, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { error: 'user doesnt exist'}); }

        if (user.password != password){ 
          return done(null, false, { error: 'invalid password' });
        }
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
    if(err) return res.send(500,{error:'database error'});
    if (!user) return res.send(400,info);

    req.login(user, function(err){
      if(err) return res.send(500,{error:'authentication error'});

      if(req.body.rememberme){
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;//one week
      } else {
        req.session.cookie.maxAge = 1000 * 60 * 60;//one hour
      }
      res.json({'role': user.role, 'email':user.email, 'name':user.name, 'currentTable':user.currentTable, '_id':user._id});
    });

  })(req, res, next);
});

app.post('/register', function(req,res){
  var b = req.body;
  Users.findOne({'email':b.email}, function(err, user){
    if (err) res.send(500,{error:'database error'});
    if(user){
      return res.send(400,{error:"user already exists"});
    }
    new Users({
      name: b.name,
      email: b.email,
      password: b.password,
      role: userRoles.user,
    }).save(function(err,user){
      if (err) return res.send(500,{error:'database error'});
      req.login(user,function(err){
        if (err) return res.send(500,{error:'authentication error'});
        res.json({'role': user.role, 'email':user.email, 'name':user.name});
      });
    });
  })
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
app.listen(app.get('port'),function(){
  console.log('Express server listening on port ' + app.get('port'));
});
