// Require Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create user schema
var UserSchema = new Schema({
	username: {
		type: String,
		unique: true,
		require: true
	},
	displayName: {
		type: String,
		require: true	
	},
	password: {
		type: String
	},
	profile_picture: {
		type: String
	}
});

module.exports = mongoose.model("User", UserSchema);