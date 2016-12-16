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
	console.log("am i authenticated?", req.isAuthenticated());
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
		console.log("am i logedd out", req.user)
		res.redirect("/")
});

// POST FOR UPDATE TO PROFILE
app.post('/profile', function(req, res) {

	console.log(req.body);

	var Update = require('./models/Update');

	var newUpdate = new Update(req.body);
	newUpdate.save(function(err, doc) {
		if(err) {
			console.log(err);
			res.send(err);
		} else {
			res.send(doc);
		}
	});
});

// MONGO CONNECTION =================================
mongoose.connect('mongodb://localhost/profileDB');
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
