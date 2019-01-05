const express = require('express');
const router = express.Router();

const listing_controller = require('../controllers/listing');

router.get('/', listing_controller.getAllListings);

module.exports = router;