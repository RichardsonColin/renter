const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ListingSchema = new Schema({
  title: {type: String, required: true},
  price: Number,
  date: Date,
  meta: {
    source: {type: String, required: true, max: 50},
    href: {type: String, required: true}
  }
});

// Export the model
module.exports = mongoose.model('Listing', ListingSchema);