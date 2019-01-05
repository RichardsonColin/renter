const schedule = require('node-schedule');

const controller = require('./createListings');

// db schemas
const Listing = require('../../models/listing');
const User = require('../../models/user');

// helpers
const listingHelpers = require('../listing_data_helpers');

// one schedule will be to loop through users and metadata from helpers then use createListing.js to create listings on a schedule
const fetchListingsScheduler = schedule.scheduleJob('5 * * * * *', function() {
  console.log('The answer to life, the universe, and everything!');

  User.find({}, function(err, users) {
    if(err) throw new Error(err);

    for(user in users) {
      let _user = users[user];
      let metadataArray = listingHelpers.generateListingMetaData(_user);

      for(metadata in metadataArray) {
        controller.createListing(_user, metadataArray[metadata]);
      }
    }
  })
});

module.exports = fetchListingsScheduler;