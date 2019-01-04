const rp = require('request-promise');
const $ = require('cheerio');
const crypto = require('crypto');

const Listing = require('../models/listing');
const User = require('../models/user');

// console.log(user);

// Use solely for req and res for client. fetching of sites and scraping will be done with another controller.


exports.listingCreate = function(req, res) {

}

/*
  Make a post req for user in user controller to modify preferences when a form
  is set up client side.

  Then use the user preferences to customize the web scraping and do the necessary
  insert or update.
*/

exports.test = function (req, mainRes, next) {
  const rentals = [];
  let userListings = [];
  // rp test
  // make into async await functions so waits before sending
  rp('https://victoria.craigslist.org/search/apa?availabilityMode=0&max_bedrooms=1&min_bedrooms=1')
    .then(res => {
      let rentalList = $('.rows > li.result-row', res);

      rentalList.each((i, e) => {
        let price = $(e).find('.result-meta').find('.result-price').text().length
          ? parseInt($(e).find('.result-meta').find('.result-price').text().replace(/\$|,/g, ''))
          : '';

        let rental = {
          source: 'craigslist',
          href: $(e).find('.result-image').attr('href'),
          date: $(e).find('.result-info').find('time').attr('datetime'),
          title: $(e).find('.result-title').text(),
          price: price
        }

        let hashedHref = crypto.createHash('sha1').update(rental.href).digest('base64');

        Listing.findOne({ hrefToHash: hashedHref }, function(err, listing) {
          if(!listing) {
            let listing = new Listing({
              hrefToHash: crypto.createHash('sha1').update(rental.href).digest('base64'),
              title: rental.title,
              price: rental.price,
              date: rental.date,
              meta: {
                source: rental.source,
                href: rental.href
              }
            });

            listing.save()
            .then(doc => {
              User.findOneAndUpdate({ username: "cojorichardson@gmail.com" }, { $push: { listings: doc } }, function (err, user) {
                if (err) throw new Error(err);
              });
              rentals.push(rental);
            })
            .catch(err => {
              throw new Error(err);
            });
          }
        });
      });

      // User.findOneAndUpdate({ username: "cojorichardson@gmail.com" }, {$push: {listings: userListings}}, function (err, user) {
      //   if (err) throw new Error(err);
      //   console.log(user);
      // });
      // mainRes.send({ rentals: rentals });
    })
    .catch(err => {
      console.log(err);
    });

  rp('https://www.usedvictoria.com/classifieds/real-estate-rentals?seller_type=&attr_7_from=1&attr_7_to=1&&location=Victoria+City')
    .then(res => {
      let rentalList = $('#recent > li', res);

      rentalList.each((i, e) => {
        let price = $(e).find('.article').find('.title').text().trim().match(/\$(\d+\,?\d+)/) !== null
          ? ($(e).find('.article').find('.title').text().trim().match(/\$(\d+\,?\d+)/)[0]).length
          ? parseInt(($(e).find('.article').find('.title').text().trim().match(/\$(\d+\,?\d+)/)[0]).replace(/\$|,/g, ""))
          : ''
          : '';

        let rental = {
          source: 'used',
          href: `https://usedvictoria.com/${$(e).find('.article').find('.title').find('a').attr('href')}`,
          date: $(e).find('.article').find('.property').find('.ad-date').data('ts'),
          title: $(e).find('.article').find('.title').text().trim(),
          price: price
        };

        let hashedHref = crypto.createHash('sha1').update(rental.href).digest('base64');

        Listing.findOne({ hrefToHash: hashedHref }, function (err, listing) {
          if (!listing) {
            let listing = new Listing({
              hrefToHash: crypto.createHash('sha1').update(rental.href).digest('base64'),
              title: rental.title,
              price: rental.price,
              date: rental.date,
              meta: {
                source: rental.source,
                href: rental.href
              }
            });

            listing.save()
            .then(doc => {
              User.findOneAndUpdate({ username: "cojorichardson@gmail.com" }, { $push: { listings: doc } }, function (err, user) {
                if (err) throw new Error(err);
              });
              rentals.push(rental);
            })
            .catch(err => {
              throw new Error(err);
            });
          }
      });
      mainRes.send({ rentals: rentals });
    })
    .catch(err => {
      console.log(err);
    });
  });
}
