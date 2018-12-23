const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/user.controller');

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

router.post('/', user_controller.create)

module.exports = router;
