const express = require('express');
const router = express.Router();

const listing_controller = require('../controllers/listing.controller');

// a simple test url to check that all of our files are communicating correctly.
router.get('/', listing_controller.test);

module.exports = router;