

const validator = require("email-validator");


module.exports = (req, res, next) => {
    if (!validator.validate(req.body.email)) {
        res.writeHead(400, '{"message":"Probleme lors de la saisie"}', {
            'content-type': 'application/json'
        });
        res.end('{"message": "Saisie incorecte"}', { 'content-type': 'application/json' })
    } else {
        next();
    };
}


