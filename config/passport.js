const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../db/pool");
const validPassword = require('../lib/passwordUtils').validPassword;

const customFields = {
  usernamefield: "uname",
  passwordField: "pw",
};

const verifyCallback = (username, password, done) => {
  pool
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then((user) => {
      if (!user) {
        return done(null, false);
      }

      const isValid = validPassword(password, user.hash, user.salt);

      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => {
        done(err);
    });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy)

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    pool
    .query("SELECT * FROM users WHERE id = $1", [userId])
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
        done(err);
    });
});