var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
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
