const rp = require('request-promise');
const $ = require('cheerio');
const crypto = require('crypto');

// db schemas
const Listing = require('../../models/listing');
const User = require('../../models/user');

const listingHelpers = require('../listing_data_helpers');

/*
  Make a post req for user in user controller to modify preferences when a form
  is set up client side.

  Then use the user preferences to customize the web scraping and do the necessary
  insert or update.
*/

exports.fetchListings = (listingMetadata) => {
  return new Promise((resolve, reject) => {
    // if(!listingMetadataArray) throw new Error('Listing metadata is required to create a new listing.');

    let fetchedRentalsArray = new Promise((resolve, reject) => {
      rp(listingMetadata.searchUrl)
      .then(res => {
        let rentalList = $(listingMetadata.pageListingsSection, res);

        let mappedList = []
        rentalList.each((i, e) => {
          let rental = listingHelpers.generateUniqueListing(e, listingMetadata);
          rental.hashedHref = crypto.createHash('sha1').update(rental.href).digest('base64');
          rental.city_id = listingMetadata.locales._id;
          mappedList.push(rental);
        });

        resolve(mappedList);
      }).catch(err => {
        if (err.error.code === 'CERT_HAS_EXPIRED') {
          console.log(`CERT_HAS_EXPIRED --- ${listingMetadata.searchUrl}`);
          resolve(); // Makes sure the promise is resolved, so the chain continues
        }
        reject(err);
      })
    });
    resolve(fetchedRentalsArray);
  });
};

exports.createListing = (rental) => {
  Listing.findOne({ hrefToHash: rental.hashedHref })
  .then(listing => {
    if (!listing) {
      let listing = new Listing({
        city_id: rental.city_id,
        hrefToHash: crypto.createHash('sha1').update(rental.href).digest('base64'),
        title: rental.title,
        price: rental.price,
        date: rental.date,
        meta: {
          source: rental.source,
          href: rental.href
        }
      });

      listing.save();
    }
  })
  .catch(err => {
    throw new Error(err);
  });
};


          // First check if listing already exists. If not, create it and create ref within the user
          // Listing.findOne({ hrefToHash: hashedHref })
          // .then(listing => {
          //   if (!listing) {
          //     let listing = new Listing({
          //       hrefToHash: crypto.createHash('sha1').update(rental.href).digest('base64'),
          //       title: rental.title,
          //       price: rental.price,
          //       date: rental.date,
          //       meta: {
          //         source: rental.source,
          //         href: rental.href
          //       }
          //     });

          //     listing.save()
          //     .then(doc => {
          //       User.findOneAndUpdate({ username: user.username }, { $push: { listings: doc } })
          //       .then(user => {
          //         console.log('findoneandupdate .then',  i);
          //       }).catch(err => {
          //         throw new Error(err);
          //       });
          //     })
          //     .catch(err => {
          //       throw new Error(err);
          //     });
          //   }
          // })
          // .catch(err => {
          //   throw new Error(err);
          // });
//         });
//       })
//       .catch(err => {
//         throw new Error(err);
//       });
//       console.log(fetchedRantalsArray);
//     }
//   });
// };

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
