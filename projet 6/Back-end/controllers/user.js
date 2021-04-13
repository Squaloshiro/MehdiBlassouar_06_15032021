const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../model/user')
const CryptoJS = require("crypto-js");
const crypto = require('crypto')


exports.signup = (req, res, next) => {


    const key = process.env.HMAC_KEY
    const email = crypto.createHmac('sha1', key)
        .update(req.body.email)
        .digest('hex')

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => {
            return res.status(500).json({ error })
        });
};

exports.login = (req, res, next) => {
    const key = process.env.HMAC_KEY
    const email = crypto.createHmac('sha1', key)
        .update(req.body.email)
        .digest('hex')
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Vérifier les informations de saisie!' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Vérifier les informations de saisie!' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error: "une erruer est survenu" }));
        })
        .catch(error => res.status(500).json({ error }));
};