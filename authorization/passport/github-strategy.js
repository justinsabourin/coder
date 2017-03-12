var GithubStrategy = require('passport-github').Strategy;
var User = require('../model/User');

module.exports = new GithubStrategy({
  clientID: 'cb3fd393d5dca44e0160',
  clientSecret: '449c9b4a4a004a57248a4a542af3efe610d19e20',
  callbackURL: 'http://localhost:8080/api/auth/github/callback'
}, function(accessToken, refreshToken, profile, done){
    User.findByUsername(profile.username, function(err, user) {
        if (err) return done(err);
        if (user) {
            if (!user.github || user.github === {}) {
                // uh oh, already have a non github user with the same username
                // throw error for now
                return done(new Error('Username already exists'));
            }
            // update the access token
            user.github.accessToken = accessToken;
            user.save(err => {
                if (err) return done(err);
                done(null, user);
            });

        } else {
            var newUser = new User({
                username: profile.username,
                github : {
                    token: accessToken,
                    username: profile.username
                }
            });
            newUser.save(err => {
                if (err) return done(err);
                done(null, newUser);
            });
        }
    });
  
});