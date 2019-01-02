const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: add id as hash of title
let ListingSchema = new Schema({
  hrefToHash: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: Number,
  date: Date,
  meta: {
    source: {
      type: String,
      required: true,
      max: 50
    },
    href: {
      type: String,
      required: true
    }
  }
});

// Export the model
module.exports = mongoose.model('Listing', ListingSchema);