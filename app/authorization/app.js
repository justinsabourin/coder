var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var redisCli = require('redis').createClient();
var redisStore = require('connect-redis')(session);
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var passport = require('./passport');
var User = require('./model/User');

// connect to mongodb
mongoose.connect('mongodb://localhost/webeditor', function(err) {
  if (err) {
    console.error('Unable to connect to mongoDB: ', err);
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    store: new redisStore({
      host: 'localhost',
      port: 6379,
      client: redisCli,
      disableTTL: true
    }),
    saveUninitialized: true,
    cookie: {httpOnly: true, sameSite: true} // HAProxy handles setting the secure property
}));
app.use(passport.initialize());
app.use(passport.session());



app.get('/api/auth/github', passport.authenticate('github'));

app.get('/api/auth/github/callback',
  passport.authenticate('github', { successRedirect: '/',
                                    failureRedirect: '/login'}));




app.post('/api/auth/signup', function(req, res, next) {
    User.findByUsername(req.body.username, function(err, user) {
      if (err) return next({status: 500, message: err});
      if (user) return next({ status: 500, message: "Username already exists" });
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
      newUser.save((err) =>{
        if (err) return next(err);
        res.json(newUser.rest());
      });
      
    });
});

app.post('/api/auth', 
  passport.authenticate('json'),
  (req, res, next) => {
    res.json(req.user.rest());
  });


app.get('/api/auth/self', function (req, res, next)  {
    if (req.user) {
      return res.json(req.user);
    }
    next({status: 401, message: "Not authenticated"});

});


app.use(function (err, req, res, next) {
    if (err.status) {
        res.status(err.status).end(err.message);
    } else {
        return next(err);
    }
});


app.listen(8082, function () {
  console.log('Authorization service listening on port 8082')
});

