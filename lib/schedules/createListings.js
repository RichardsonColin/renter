const rp = require('request-promise');
const $ = require('cheerio');
const crypto = require('crypto');

// db schemas
const Listing = require('../models/listing');
const User = require('../models/user');

const listingHelpers = require('../listing_data_helpers');

/*
  Make a post req for user in user controller to modify preferences when a form
  is set up client side.

  Then use the user preferences to customize the web scraping and do the necessary
  insert or update.
*/

exports.createListing = function (user, listingMetadata) {
  if(!listingMetadata) throw new Error('Listing metadata is required to create a new listing.');

  // make into async await functions so waits before sending
  rp(listingMetadata.url)
  .then(res => {
    let rentalList = $(listingMetadata.pageListingsSection, res);

    rentalList.each((i, e) => {
      let rental = listingHelpers.generateUniqueListing(e, listingMetadata.source);
      let hashedHref = crypto.createHash('sha1').update(rental.href).digest('base64');

      // let price = $(e).find('.result-meta').find('.result-price').text().length
      //   ? parseInt($(e).find('.result-meta').find('.result-price').text().replace(/\$|,/g, ''))
      //   : '';

      // // make parent function have a cb that accepts e to get proper elms
      // let rental = {
      //   source: 'craigslist',
      //   href: $(e).find('.result-image').attr('href'),
      //   date: $(e).find('.result-info').find('time').attr('datetime'),
      //   title: $(e).find('.result-title').text(),
      //   price: price
      // }

      // First check if listing already exists. If not, create it and create ref within the user
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
            User.findOneAndUpdate({ username: user.username }, { $push: { listings: doc } }, function (err, user) {
              if (err) throw new Error(err);
            });
          })
          .catch(err => {
            throw new Error(err);
          });
        }
      });
    });
  })
  .catch(err => {
    throw new Error(err);
  });
};

//   rp('https://www.usedvictoria.com/classifieds/real-estate-rentals?seller_type=&attr_7_from=1&attr_7_to=1&&location=Victoria+City')
//     .then(res => {
//       let rentalList = $('#recent > li', res);

//       rentalList.each((i, e) => {
//         let price = $(e).find('.article').find('.title').text().trim().match(/\$(\d+\,?\d+)/) !== null
//           ? ($(e).find('.article').find('.title').text().trim().match(/\$(\d+\,?\d+)/)[0]).length
//             ? parseInt(($(e).find('.article').find('.title').text().trim().match(/\$(\d+\,?\d+)/)[0]).replace(/\$|,/g, ""))
//             : ''
//           : '';

//         let rental = {
//           source: 'used',
//           href: `https://usedvictoria.com/${$(e).find('.article').find('.title').find('a').attr('href')}`,
//           date: $(e).find('.article').find('.property').find('.ad-date').data('ts'),
//           title: $(e).find('.article').find('.title').text().trim(),
//           price: price
//         };

//         let listing = new Listing({
//           hrefToHash: crypto.createHash('sha1').update(rental.href).digest('base64'),
//           title: rental.title,
//           price: rental.price,
//           date: rental.date,
//           meta: {
//             source: rental.source,
//             href: rental.href
//           }
//         });

//         listing.save()
//           .then(doc => {
//             User.findOneAndUpdate({ username: "cojorichardson@gmail.com" }, { $push: { listings: doc } }, function (err, user) {
//               if (err) throw new Error(err);
//             });
//             rentals.push(rental);
//           })
//           .catch(err => {
//             throw new Error(err);
//           });
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
