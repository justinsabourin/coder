var passport = require('passport');
passport.use(require('./github-strategy'));
passport.use(require('./json-strategy'));

passport.serializeUser(function(user, done) {
  done(null, {
      username: user.username,
  });
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;