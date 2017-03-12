var passport = require('passport');
passport.use(require('./github-strategy'));
passport.use(require('./json-strategy'));

passport.serializeUser(function(user, done) {
  done(null, {
      username: user.username,
      github_token: user.github ? user.github.token : undefined
  });
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;