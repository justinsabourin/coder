var express = require('express');
var User = require('../model/User');
var passport = require('../passport');

var router = express.Router();

if (process.env.NODE_ENV === 'production') {
// seed
  let user = new User({
    username: 'demoaccount',
    password: 'demo_password'
  });
  user.save();

}

router.get('/logout', function(req, res, next) {
  if (!req.user) {
    return res.json({status: 401, message: 'Unauthenticated'});
  }
  req.logout();
  res.end();
});


router.get('/github', passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate('github', { successRedirect: '/',
                                    failureRedirect: '/login'}));

router.post('/signup', function(req, res, next) {
    User.findByUsername(req.body.username, function(err, user) {
      if (err) return next({status: 500, message: err});
      if (user) return next({ status: 500, type: "json", message: { type: 'username', message: "Username already exists" }});
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
      newUser.save((err) =>{
        if (err) return next(err);
        req.login(newUser, (err) => {
            if (err) return next({status: 500, message: err});
            return res.json(newUser.rest());
        });
      });
    });
});

router.post('/', 
  passport.authenticate('json'),
  (req, res, next) => {
    res.json(req.user.rest());
  });


router.get('/self', function (req, res, next)  {
    if (req.user) {
      return res.json(req.user);
    }
    next({status: 401, message: "Not authenticated"});

});

module.exports = router;