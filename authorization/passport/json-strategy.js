var JsonStrategy = require('passport-json').Strategy;
var User = require('../model/User');

module.exports = new JsonStrategy(
  function(username, password, done) {
    User.findByUsername(username, function(err, user) {
        if (err) return done({ status: 500, message: err });
        if (!user || !user.password || !user.comparePassword(password)) 
            return done({ status: 401, message: "Username or password is incorrect" });
        
        done(null, user);
    });
  }
);