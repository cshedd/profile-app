var passport = require('passport');
var InstagramStrategy = require('passport-instagram').Strategy;
var User = require('./../models/User');
var config = require('./auth');


// expose this function to app using module.exports
module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findOne({id : id}).then(function(user) {
			done(null, user);
		}).catch(function(err) {
			done(err, null);
		});
	});

	// required for persistent login
	// passport needs ability to serialize and deserialize users out of session
	passport.use(new InstagramStrategy({
		clientID: "4b4a7f9e8c7b41a6b09a0bc811159979",
		clientSecret: "5c40602d4e004ec39c6f74483a618f57",
		callbackURL: "http://localhost:3000/auth/instagram/callback"
	},


	// 2. CHECKING FOR USER, IF FINDS CALLDONE AND PASSES IN USER OBJECT THATS CALLED BACK, IF FINDS USER (USER, ERR) IS WHAT POPULATES DB
	// 3. THEN CALLS DONE
	function(token, refreshToken, profile, done) {
		// asynchronous verification
		process.nextTick(function() {
			User.findOne( {username : profile.username  }).then(function (user, err) {
					// console.log(user);
					// console.log(token);
					// console.log(refreshToken);
					// console.log(profile);
				if(err) {
					return done(err);					
				}
				if(user) {
					return done(null, user);
				}
					// create the user
					var user = new User({
						username : profile.username,
						displayName : profile.displayName,
						password: token
					}); 
					user.save(function (err, user) {
						console.log("dis be error",err);
						console.log("dis be user: ",user)
						return done(null, user);
					});
			});
		});
	}));
};