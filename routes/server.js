const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const $ = require('cheerio');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

router.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT'});
});

module.exports = router;