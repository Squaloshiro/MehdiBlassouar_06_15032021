const mongoose = require('mongoose');
/*var encrypt = require('mongoose-encryption');
var encKey = 'Q7zn+ucE8D8UDNoTU//GSX/Li5qFtl42bjIeRP8zUJc=';
var sigKey = 'qVIc+mxrmA27k/3do7KHH3KcC9TV5iApU8Hz49QR0EnCtLbIfGNIjkjU2g7C8te0QKEO0K2x410chLZjbdO0TA=='*/

var CryptoJS = require("crypto-js");


const uniqueValidator = require('mongoose-unique-validator');

const userShema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})





userShema.plugin(uniqueValidator);

//userShema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey })
module.exports = mongoose.model('user', userShema)
