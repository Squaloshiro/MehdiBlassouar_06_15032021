

const mdpSchema = require('../model/mdp');



module.exports = (req, res, next) => {
    if (!mdpSchema.validate(req.body.password)) {

        res.writeHead(400, '{"message":"Mot de passe requis : 8 caractères minimun. Au moins 1 Majuscule, 1 minuscule. Sans espaces"}', {
            'content-type': 'application/json'
        });
        res.end('{"message": "Format de mot de passe incorrect"}', { 'content-type': 'application/json' })
    } else {
        next();
    }
};