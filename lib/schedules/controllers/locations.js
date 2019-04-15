const Location = require('../../../models/location');

exports.createLocation = (location) => {
  // check for existing record before saving
  Location.findOne({ domain: location.domain, province: location.province })
  .then(locationRecord => {
    if(!locationRecord) {
      let newLocation = new Location({
        domain: location.domain,
        province: location.province,
        locales: location.locale
      });
      newLocation.save();
    }
  })
  .catch(err => {
    reject(err);
  });
};
