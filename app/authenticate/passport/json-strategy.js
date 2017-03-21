var JsonStrategy = require('passport-json').Strategy;
var User = require('../model/User');

module.exports = new JsonStrategy(
  function(username, password, done) {
    User.findByUsername(username, function(err, user) {
        if (err) return done({ status: 500, message: err });
        if (!user || !user.password) 
            return done({ status: 401, type: 'json', message: { type: 'username', message: "Username does not exist" }});
        if (!user.comparePassword(password))
            return done({ status: 401, type: 'json', message: { type: 'password', message: "Password is incorrect" }});
        done(null, user);
    });
  }
);