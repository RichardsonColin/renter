const mongoose = require('mongoose');

const User = require('../models/user.model');

/*
  See listing controller

  Used for user preferences to modify web scraping url params.
*/

exports.create = function(req, res) {
  let newUser = new User({
    username: req.body.username,
    password: req.body.password
  });

  newUser.save(err => {
    if(err) throw err;

    // fetch user and test password verification
    User.findOne({ username: newUser.username }, function(err, user) {
    if(err) throw err;

      // test a matching password
      user.comparePassword(newUser.password, function(err, isMatch) {
        if(err) throw err;
        console.log(`${newUser.password}: `, isMatch);
      });

      // test a failing password
      user.comparePassword(newUser.password, function(err, isMatch) {
        if(err) throw err;
        console.log(`${newUser.password}: `, isMatch);
      });
    });
    
    res.send('User successfully created.');
  });
};