const express = require('express');
const router = express.Router();
const verifMdp = require('../middleware/verifMdp');
const verifEmail = require('../middleware/verifemail');
const userCtrl = require('../controllers/user');

var ExpressBrute = require('express-brute');

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);


router.post('/signup', verifMdp, verifEmail, userCtrl.signup);
router.post('/login', bruteforce.prevent, userCtrl.login);

module.exports = router;