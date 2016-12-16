var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UpdateSchema = new Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true

  }
});

var Update = mongoose.model('Update', UpdateSchema);

module.exports = Update;