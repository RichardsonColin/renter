const $ = require('cheerio');

exports.generateListingMetaData = function(location) {
  // if(!user) throw new Error('A user is required to generate proper metadata.');

  switch(location.domain) {
    case 'craigslist':
      location.domainUrl = location.locales.href;
      location.searchUrl = `${location.locales.href}search/apa?availabilityMode=0&max_bedrooms=1&min_bedrooms=1`;
      location.pageListingsSection = '.rows > li.result-row';
      return location;
    case 'used':
      location.domainUrl = location.locales.href;
      location.searchUrl = `${location.locales.href}/classifieds/real-estate-rentals?seller_type=&attr_7_from=1&attr_7_to=1`;
      location.pageListingsSection = '#recent > li';
      return location;
    default:
      return {};
  }
  // return [
  //   {
  //     source: 'craigslist',
  //     url: `https://${user.rentalPrefs.city}.craigslist.org/search/apa?availabilityMode=0&max_bedrooms=${user.rentalPrefs.bedrooms.max}&min_bedrooms=${user.rentalPrefs.bedrooms.max}`,
  //     pageListingsSection: '.rows > li.result-row'
  //   },
  //   {
  //     source: "used",
  //     url: `https://www.used${user.rentalPrefs.city}.com/classifieds/real-estate-rentals?seller_type=&attr_7_from=${user.rentalPrefs.bedrooms.min}&attr_7_to=${user.rentalPrefs.bedrooms.max}`,
  //     pageListingsSection: '#recent > li'
  //   }
  // ];
};

exports.generateUniqueListing = function(element, metaData) {
  if(!element || !metaData) throw new Error('An element and a metaData are required to generate proper listing data.');
  let $e = $(element);

  switch(metaData.domain) {
    case 'craigslist':
      // price is either a string stripped of '$' and ',' then turned to an integer.
      // or it's an empty string.
      return {
        source: metaData.domain,
        href: $e.find('.result-image').attr('href'),
        date: $e.find('.result-info').find('time').attr('datetime'),
        title: $e.find('.result-title').text(),
        price: $e.find('.result-meta').find('.result-price').text().length
          ? parseInt($e.find('.result-meta').find('.result-price').text().replace(/\$|,/g, ''))
          : ''
      };
    case 'used':
      // price is located within the title so it's isolated if not null and
      // stripped of '$' and ',' then turned to an integer.
      // else it's an empty string
      return {
        source: metaData.domain,
        href: `${metaData.domainUrl}${$e.find('.article').find('.title').find('a').attr('href')}`,
        date: $e.find('.article').find('.property').find('.ad-date').data('ts'),
        title: $e.find('.article').find('.title').text().trim(),
        price: $e.find('.article').find('.title').text().trim().match(/\$(\d+\,?\d+)/) !== null
          ? ($e.find('.article').find('.title').text().trim().match(/\$(\d+\,?\d+)/)[0]).length
            ? parseInt(($e.find('.article').find('.title').text().trim().match(/\$(\d+\,?\d+)/)[0]).replace(/\$|,/g, ""))
            : ''
          : ''
      };
    default:
      return {};
  };
};
