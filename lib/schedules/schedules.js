const schedule = require('node-schedule');

const controller = require('./createListings');
const fetchCitiesController = require('./fetchCities');
const locationsSchedController = require('./controllers/locations')

// db schemas
const Listing = require('../../models/listing');
const User = require('../../models/user');
const Location = require('../../models/location');

// helpers
const listingHelpers = require('../listing_data_helpers');
const domains = require('../domain_meta');

// one schedule will be to loop through users and metadata from helpers then use createListing.js to create listings on a schedule
const fetchListingsScheduler = new Promise((resolve, reject) => {
  // schedule.scheduleJob('*/5 * * * *', () => {
    console.log('The answer to life, the universe, and everything!');
    let startTime = new Date().getTime();

    Location.aggregate( [ { $unwind: "$locales" } ] )
    .then(locations => {
      let metaData = locations.map(loc => listingHelpers.generateListingMetaData(loc));
      return metaData.map(loc => controller.fetchListings(loc));
    })
    .then(listingsPromises => {
      return Promise.all( listingsPromises );
    })
    .then( listings => {
      let listingsArr = [].concat(...listings.map(listing => listing));
      for(listing of listingsArr) {
        controller.createListing(listing);
      }
      return `Total time: ${(new Date().getTime() - startTime) / 1000}`;
    })
    .then(time => {
      console.log(time);
    })
    .catch(err => {
      console.log(err);
    });
});

// TODO: run from server.js. Use sch/locations.js as db point
const fetchCityScheduler = new Promise((resolve, reject) => {
  schedule.scheduleJob('* 1 * * * *', () => {
    let startTime = new Date().getTime();

    for(domain of domains) {
      fetchCitiesController.fetchCities(domain)
      .then(locations => {
        console.log(`Total time: ${(new Date().getTime() - startTime) / 1000}s aaaaa`);
        for(location of locations) {
          locationsSchedController.createLocation(location);
        }
      })
      .catch(err => {
        reject(err);
      });
    }
  });
});

module.exports = fetchListingsScheduler;