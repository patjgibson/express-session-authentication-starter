const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../db/pool");
const validPassword = require('../lib/passwordUtils').validPassword;

const customFields = {
  usernameField: "username",
  passwordField: "password",
};

const verifyCallback = (username, password, done) => {
  console.log("Verifying verifyCallback");
  
  pool
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then((user) => {
      console.log("Attempting login");
      console.log(user.rows[0]);
      
      
      if (!user) {
        return done(null, false);
      }

      const isValid = validPassword(password, user.rows[0].hash, user.rows[0].salt);

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
  console.log("Logging the user");
  
  console.log(user);
  
    done(null, user.rows[0].id);
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