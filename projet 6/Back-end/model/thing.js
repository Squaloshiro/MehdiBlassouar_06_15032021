const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({

    sauce: { type: Object, require: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    heat: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    mainPepper: { type: String, required: true },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
    userId: { type: String, required: true },

});



module.exports = mongoose.model('thing', thingSchema);
