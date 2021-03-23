const express = require('express');
const router = express.Router();
const verifMdp = require('../middleware/verifMdp');
const userCtrl = require('../controllers/user');

router.post('/signup', verifMdp, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;