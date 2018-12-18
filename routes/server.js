const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const $ = require('cheerio');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

router.get('/express_backend', (req, mainRes) => {
  const rentals = [];
  // rp test
  // make into async await functions so waits before sending
  rp('https://victoria.craigslist.org/search/apa?availabilityMode=0&max_bedrooms=1&min_bedrooms=1')
    .then(res => {
      let rentalList = $('.rows > li.result-row', res);
      console.log(rentalList.length);
      rentalList.each((i, e) => {
        rentals.push({
          source: 'craigslist',
          href: $(e).find('.result-image').attr('href'),
          date: $(e).find('.result-info').find('time').attr('datetime'),
          title: $(e).find('.result-title').text(),
          price: $(e).find('.result-meta').find('.result-price').text()
        });
      });
      // mainRes.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT', rentals: rentals });
      // console.log(rentals);
    })
    .catch(err => {
      console.log(err);
    });

  rp('https://www.usedvictoria.com/classifieds/real-estate-rentals?seller_type=&attr_7_from=1&attr_7_to=1&&location=Victoria+City')
    .then(res => {
      // console.log(res);
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
      mainRes.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT', rentals: rentals });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/users', function (req, res, next) {
  res.send({ users:
    [{
      id: 1,
      username: "senpai777"
    }, {
        id: 2,
        username: "D0loresH4ze"
    }]
  });
});

module.exports = router;