const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/:username', userController.getOne);

/* GET users. */
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

router.post('/', userController.create);

module.exports = router;
