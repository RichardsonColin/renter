const rp = require('request-promise');
const $ = require('cheerio');

// db schemas
const Location = require('../../models/location');

const listingHelpers = require('../listing_data_helpers');

// website specific html query selector methods to organize cities by province.
const getLocations = (domain) => {
  switch (domain) {
    case 'craigslist':
      return ((html) => {
        let locations = [];
        let $c = $(html).find('a[name="CA"]').parent().next('.colmask').find('.box');

        $c.each((i, e) => {
          $(e).find('h4').each((i, e) => {
            let $li = $($(e).parent().find('ul')[i]).find('li');
            let location = { domain };
            location["province"] = $(e).text().toLowerCase();
            location["locale"] = [];

            $li.each((i, e) => {
              location.locale.push({
                city: $(e).find('a').text().toLowerCase(),
                href: $(e).find('a').attr('href')
              });
            });
            locations.push(location);
          });
        });
        return locations;
      });
    case 'used':
      return ((html) => {
        let locations = [];
        let optgroup = $(html).find('#selectSite').find('optgroup');

        optgroup.each((i, e) => {
          let location = { domain };
          location["province"] = $(e).attr('label').toLowerCase();
          location["locale"] = [];

          $(e).find('option').each((i, e) => {
            location.locale.push({
              city: $(e).text().toLowerCase(),
              href: `https://${$(e).val()}`,
            });
          });
        locations.push(location);
        });
        return locations;
      });
    default:
      return [];
  }
}

exports.fetchLocation = (domain) => {
  return new Promise((resolve, reject) => {
    let gL = getLocations(domain.domain);

    rp(domain.source)
    .then(html => {
      if(!html.length) {
        console.error('Unable to fetch HTML');
      }
      let locationsData = gL(html);

      if (Array.isArray(locationsData) && locationsData.length) {
        resolve(locationsData);
      }
    })
    .catch(err => {
      reject(err);
    });
  });
};