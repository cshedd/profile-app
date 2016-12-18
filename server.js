var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var passport = require('passport');
var session = require("express-session");

// ==================================================
var PORT = 3000;
mongoose.Promise = Promise;
var app = express();

var user;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// ===================================================
// SEND TO INSTAGRAM TO AUTHENTICATE
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static(__dirname + '/public'));

// PASSPORT
app.use(session({
	resave: true,
	saveUninitialized: false,
	secret: '1234'
}));
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


// ROUTES ========================================
app.get("/", function(req,res){
	res.render("index");
});


app.get("/profile", function(req,res){
	res.header('Access-Control-Allow-Credentials', true);
	console.log("am i authenticated?",req.isAuthenticated());
	res.render("profile", user);
});


// INITIAL ROUTE TO PASSPORT.JS =================
app.get('/auth/instagram/login', passport.authenticate('instagram'));

// HANDLE CALLBACK AFTER INSTAGRAM HAS AUTHORIZED USER 4. WHEN CALL DONE, THIS ROUTE GETS CALLED ; IF FAILS, GOES BACK TO LOGIN
// 5. CREATE "SOME THING WENT WRONG, TRY AGAIN" MAKE ROUTE APP.GET/ERROR AND RENDER OUT AN ERROR PAGE
// 6. IF SUCCEEDS THEN THATS WHERE REQ.USER GETS POPULATED - USING EXPRESS-SESSION
app.get('/auth/instagram/callback', 
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    user = req.user;
    console.log("I AM THE ONE LOGGED IN:", req.isAuthenticated())
    res.redirect("/profile");
  });

app.get("/logout", function(req, res){
		console.log("this is the logged in user that is about to be logged out", req.user)
		req.logout();
		console.log("am i logged out", req.user)
		res.redirect("/")
});


// MONGO CONNECTION =================================
// var MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost/profileDB';


mongoose.connect(

				'mongodb://heroku_l5n8hd2h:hgp3ti46o7mr6mlo9hi9s7096e@ds039010.mlab.com:39010/heroku_l5n8hd2h'

	);
var db = mongoose.connection;

app.listen(process.env.PORT || 3000);
console.log("Listening on port", PORT);

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// MONGOOSE ERRORS
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});