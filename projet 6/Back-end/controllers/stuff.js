
const Thing = require('../model/thing');

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

exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ?
        {
            ...JSON.parse(req.body.thing),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Thing.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
}

exports.getAllThing = (req, res, next) => {

    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }))
}




exports.like = async (req, res, next) => {

    let { like, userId } = req.body
    let sauceId = req.params.id
    try {
        if (like === 1) {
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
                    error
                })
            }
        }
        if (like === -1) {
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
                    error
                })
            }
        }
        if (like === 0) {
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
                            error
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
                    error
                })
            }
        }
    }
    catch (error) {
        res.status(404).json({
            error
        })
    }
}
