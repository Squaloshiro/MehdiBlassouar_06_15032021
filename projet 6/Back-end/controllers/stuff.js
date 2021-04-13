
const Thing = require('../model/thing');
const jwt = require('jsonwebtoken');

const fs = require('fs');

exports.createThing = (req, res, next) => {

    const thingObject = JSON.parse(req.body.sauce);
    delete thingObject._id;

    const thing = new Thing({
        ...thingObject,

        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));

};

exports.modifyThing = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN,);
    const userId = decodedToken.userId;

    // if (!req.body.name || !req.body.manufacturer || !req.body.description || !req.body.mainPepper) {
    //     return res.status(400).json({ error: "test" })
    // }


    try {
        const checkSauce = await Thing.findOne({
            _id: req.params.id
        })
        req.body.likes = checkSauce.likes

        if (checkSauce) {

            if (userId === checkSauce.userId) {
                const thingObject = req.file ? (
                    Thing.findOne({
                        _id: req.params.id
                    }).then((sauce) => {
                        const filename = sauce.imageUrl.split('/images/')[1]
                        fs.unlinkSync(`images/${filename}`)
                    }),
                    {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                    }) : { ...req.body };
                var opts = { runValidators: true };


                Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id }, opts)
                    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                    .catch(error => res.status(400).json({ error: "erreur la sauce n'a pas pu être modifié" }))
            } else {
                res.status(400).json({ error: 'cette sauce ne vous appartient pas' })
            }
        } else {
            res.status(400).json({ error: 'cette sauce éxiste pas' })
        }
    } catch (error) {
        res.status(400).json({ error: 'une erreur est survenu' })
    }

};

exports.deleteThing = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN,);
    const userId = decodedToken.userId;
    try {
        const checkSauce = await Thing.findOne({
            _id: req.params.id
        })
        if (checkSauce) {
            if (userId === checkSauce.userId) {
                Thing.findOne({ _id: req.params.id })
                    .then(thing => {
                        const filename = thing.imageUrl.split('/images/')[1];
                        fs.unlink(`images/${filename}`, () => {
                            Thing.deleteOne({ _id: req.params.id })
                                .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                                .catch(error => res.status(400).json({ error }));
                        });
                    })
            } else {
                res.status(400).json({ error: 'cette sauce ne vous appartient pas' })
            }
        } else {
            res.status(400).json({ error: 'cette sauce éxiste pas' })
        }
    } catch (error) {
        res.status(400).json({ error: 'une erreur est survenu' })
    }



};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error: 'cette sauce éxiste pas' }));
}

exports.getAllThing = (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }))
}




exports.like = async (req, res, next) => {

    let { like, userId } = req.body
    let sauceId = req.params.id


    if (!userId || !sauceId) {
        res.status(400).json({ message: 'donné incomplete' })
        return
    }
    const thing = await Thing.findOne({
        _id: sauceId
    })
    if (like === 1) {

        if (thing.usersDisliked.includes(userId) && thing.usersLiked.includes(userId) === false) {
            return res.status(400).json({
                error: 'action impossible'
            })
        }

        if (thing.usersLiked.includes(userId) === false) {
            try {

                await Thing.updateOne({
                    _id: sauceId
                }, {
                    $push: {
                        usersLiked: userId
                    },
                    $inc: {
                        likes: +1
                    },
                })
                res.status(200).json({
                    message: 'j aime ajouté !'
                })
            } catch (error) {
                res.status(400).json({
                    error: 'cette sauce éxiste pas'
                })
            }
        } else {
            res.status(400).json({
                error: 'vous avez déjà liker'
            })
        }

    }
    else if (like === -1) {
        const thing = await Thing.findOne({
            _id: sauceId
        })
        if (thing.usersDisliked.includes(userId) === false && thing.usersLiked.includes(userId)) {
            return res.status(400).json({
                error: 'action impossible'
            })
        }
        if (thing.usersDisliked.includes(userId) === false) {
            try {
                await Thing.updateOne({
                    _id: sauceId
                }, {
                    $push: {
                        usersDisliked: userId
                    },
                    $inc: {
                        dislikes: +1
                    },
                })
                res.status(200).json({
                    message: 'Dislike ajouté !'
                })
            }
            catch (error) {
                res.status(400).json({
                    error: 'cette sauce éxiste pas'
                })
            }
        } else {
            res.status(400).json({
                error: 'vous avez déjà disliker'
            })
        }
    }
    else if (like === 0) {
        try {
            const thing = await Thing.findOne({
                _id: sauceId
            })
            if (thing.usersLiked.includes(userId)) {
                try {
                    await Thing.updateOne({
                        _id: sauceId
                    }, {
                        $pull: {
                            usersLiked: userId
                        },
                        $inc: {
                            likes: -1
                        },
                    })
                    res.status(200).json({
                        message: 'Like retiré !'
                    })
                } catch (error) {
                    res.status(400).json({
                        error: 'cette sauce éxiste pas'
                    })
                }
            }
            if (thing.usersDisliked.includes(userId)) {
                try {
                    await Thing.updateOne({
                        _id: sauceId
                    }, {
                        $pull: {
                            usersDisliked: userId
                        },
                        $inc: {
                            dislikes: -1
                        },
                    })
                    res.status(200).json({
                        message: 'Dislike retiré !'
                    })
                } catch (error) {
                    res.status(400).json({
                        error
                    })
                }
            }
        } catch (error) {
            res.status(400).json({
                error: 'cette sauce éxiste pas'
            })
        }
    } else {
        res.status(400).json({
            error: 'cette sauce éxiste pas'
        })
    }
}
