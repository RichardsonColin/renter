const $ = require('cheerio');

exports.generateListingMetaData = function(user) {
  if(!user) throw new Error('A user is required to generate proper metadata.');

  return [
    {
      source: 'craigslist',
      url: `https://${user.rentalPrefs.city}.craigslist.org/search/apa?availabilityMode=0&max_bedrooms=${user.rentalPrefs.bedrooms.max}&min_bedrooms=${user.rentalPrefs.bedrooms.max}`,
      pageListingsSection: '.rows > li.result-row'
    },
    {
      source: "used",
      url: `https://www.used${user.rentalPrefs.city}.com/classifieds/real-estate-rentals?seller_type=&attr_7_from=${user.rentalPrefs.bedrooms.min}&attr_7_to=${user.rentalPrefs.bedrooms.max}&&location=Victoria+City`,
      pageListingsSection: '#recent > li'
    }
  ];
};

exports.generateUniqueListing = function(element, source) {
  if(!element || !source) throw new Error('An element and a source are required to generate proper listing data.');
  let $e = $(element);

  switch(source) {
    case 'craigslist':
      // price is either a string stripped of '$' and ',' then turned to an integer.
      // or it's an empty string.
      return {
        source: source,
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
        source: source,
        href: `https://usedvictoria.com/${$e.find('.article').find('.title').find('a').attr('href')}`,
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
