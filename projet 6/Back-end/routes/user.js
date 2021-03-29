const express = require('express');
const router = express.Router();
const verifMdp = require('../middleware/verifMdp');
const verifEmail = require('../middleware/verifemail');
const userCtrl = require('../controllers/user');

router.post('/signup', verifMdp, verifEmail, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;