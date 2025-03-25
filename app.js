require('dotenv').config();

const express = require('express');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes');

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax

// Create the Express application
var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


/**
 * -------------- SESSION SETUP ----------------
 */

const pool = require("./db/pool");
app.use(session({secret: "cats", resave: false, saveUninitialized: false }));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    if (req.user) {
        // console.log("Is admin: " + req.user.rows[0].admin);
    }
    next();
})


/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);


/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(process.env.PORT);