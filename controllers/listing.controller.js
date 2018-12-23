const rp = require('request-promise');
const $ = require('cheerio');

const listing = require('../models/listing.model');

exports.listingCreate = function(req, res) {
  
}

/* 
  Make a post req for user in user controller to modify preferences when a form
  is set up client side.

  Then use the user preferences to customize the web scraping and do the necessary 
  insert or update.
*/

exports.test = function(req, mainRes, next) {
  const rentals = [];
  // rp test
  // make into async await functions so waits before sending
  rp('https://victoria.craigslist.org/search/apa?availabilityMode=0&max_bedrooms=1&min_bedrooms=1')
    .then(res => {
      let rentalList = $('.rows > li.result-row', res);

      rentalList.each((i, e) => {
        rentals.push({
          source: 'craigslist',
          href: $(e).find('.result-image').attr('href'),
          date: $(e).find('.result-info').find('time').attr('datetime'),
          title: $(e).find('.result-title').text(),
          price: $(e).find('.result-meta').find('.result-price').text()
        });
      });
      // mainRes.send({ rentals: rentals });
    })
    .catch(err => {
      console.log(err);
    });

  rp('https://www.usedvictoria.com/classifieds/real-estate-rentals?seller_type=&attr_7_from=1&attr_7_to=1&&location=Victoria+City')
    .then(res => {
      let rentalList = $('#recent > li', res);

      rentalList.each((i, e) => {
        rentals.push({
          source: 'used',
          href: `https://usedvictoria.com/${$(e).find('.article').find('.title').find('a').attr('href')}`,
          date: $(e).find('.article').find('.property').find('.ad-date').data('ts'),
          title: $(e).find('.article').find('.title').text().trim(),
          price: $(e).find('.article').find('.title').text().trim().match(/\$(\d+\,?\d+)/)[0]
        })
      });
      mainRes.send({ rentals: rentals });
    })
    .catch(err => {
      console.log(err);
    });
};