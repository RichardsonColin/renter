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
  schedule.scheduleJob('*/10 * * * *', () => {
    console.log('The answer to life, the universe, and everything!');
    let startTime = new Date().getTime();

    Location.aggregate( [ { $unwind: '$locales' } ] )
    .then(locations => {
      console.log(`${locations.length} LOCALES RETRIEVED --- ${(new Date().getTime() - startTime) / 1000}`);
      let metaData = locations.map(loc => listingHelpers.generateListingMetaData(loc));
      let fetchedListings = metaData.map(loc => controller.fetchListings(loc));
      return Promise.all(fetchedListings);
    })
    .then(listingsPromises => {
      let listings = listingsPromises.map(lis => controller.mapListings(lis));
      let listingsArr = [].concat(...listings.map(listing => listing));
      console.log(`${listingsArr.length} LISTINGS FETCHED --- ${(new Date().getTime() - startTime) / 1000}`);
      for(listing of listingsArr) {
        controller.createListing(listing);
      }

      console.log(`DB WRITE COMPLETE --- Total time: ${(new Date().getTime() - startTime) / 1000}`);
      console.log("\n -------------------------------- \n");
    })
    .catch(err => {
      console.log('--- PM CHAIN ERROR --- \n', err);
    });
  });
});

// TODO: run from server.js. Use sch/locations.js as db point
// refactor loops (HTML nodes traversal)
const fetchCityScheduler = new Promise((resolve, reject) => {
  schedule.scheduleJob('01 10 * * * *', () => {
    let startTime = new Date().getTime();

    let regions = domains.map(domain => fetchCitiesController.fetchLocation(domain));
    Promise.all(regions)
    .then(regions => {
      console.log(`${regions.length} REGIONS FETCHED --- ${(new Date().getTime() - startTime) / 1000}s`);
      regions = [].concat(...regions);
      for(location of regions) {
        locationsSchedController.createLocation(location);
      }
    })
    .catch(err => {
      console.log('FETCH CITIES ERROR: ', err);
    });
  });
});

module.exports = fetchListingsScheduler;