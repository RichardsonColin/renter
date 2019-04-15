const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LocationSchema = new Schema({
  domain: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  locales: [{
    city: {
      type: String,
      required: true
    },
    href: String
  }]
});

// Export the model
module.exports = mongoose.model('Location', LocationSchema);