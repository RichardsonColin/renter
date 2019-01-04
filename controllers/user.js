const mongoose = require('mongoose');

const User = require('../models/user');

/*
  See listing controller

  Used for user preferences to modify web scraping url params.
*/
exports.getOne = function(req, res) {
  if(req.params.username) {
    User.find({ username: req.params.username }, function(err, user) {
      if(err) throw new Error(err);
      res.send(user.length !== 0);
    });
  }
};
exports.create = function(req, res) {
  console.log(req.body);
  if (req.body.username && req.body.password) {
    let user = new User({
      username: req.body.username,
      password: req.body.password,
      rentalPrefs: {
        city: req.body.rental_prefs.city,
        bedrooms: {
          min: req.body.rental_prefs.min_bedrooms,
          max: req.body.rental_prefs.max_bedrooms
        }
      }
    });

    user.save()
    .then(user => {
      res.send('User successfully created.');
    })
    .catch(err => {
      throw new Error(err);
    });
  } else {
    // TODO: handler for missing req.body data
  }
};