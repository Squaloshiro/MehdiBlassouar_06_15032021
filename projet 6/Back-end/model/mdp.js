const mdpValidator = require('password-validator');


const mdpdSchema = new mdpValidator();


mdpdSchema
    .is().min(8)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);

module.exports = mdpdSchema;