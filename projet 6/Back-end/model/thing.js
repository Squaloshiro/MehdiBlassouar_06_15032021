const mongoose = require('mongoose');

const sanitizerPlugin = require('mongoose-sanitizer-plugin')
const validate = require('mongoose-validator')

const verifSauce = require('../middleware/verifSauce');


const thingSchema = mongoose.Schema({

    sauce: { type: Object, require: true },
    name: { type: String, required: true, unique: true, validate: verifSauce.nameValidator },
    manufacturer: { type: String, required: true, validate: verifSauce.manufacturerValidator },
    description: { type: String, required: true, validate: verifSauce.descriptionValidator },
    heat: { type: Number, required: true, min: 1, max: 10 /*validate: verifSauce.heatValidator */ },
    imageUrl: { type: String, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    mainPepper: { type: String, required: true, validate: verifSauce.pepperValidator },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
    userId: { type: String, required: true },

});

// purifie les champs du model avant de les enregistrer dans la base MongoDB.
// Utilise le HTML Sanitizer de Google Caja pour effectuer la désinfection.

thingSchema.plugin(sanitizerPlugin)


module.exports = mongoose.model('thing', thingSchema);
