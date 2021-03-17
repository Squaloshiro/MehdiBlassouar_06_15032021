const express = require('express');
const bodyParser = require('body-parser')

//const mongoose = require('mongoose');

//const Thing = require('./model/thing');

/*mongoose.connect('mongodb+srv://Squaloshiro:Presea73@cluster0.ax98j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));*/


const app = express();



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});



app.use(bodyParser.json())



app.post('/api/sauces', (req, res, next) => {
    console.log('--------------req.body----------------------');
    console.log(req.body);
    console.log('------------------------------------');
    // delete req.body._id
    //const thing = new Thing({
    //     ...req.body
    // })
    // console.log('----------------thing--------------------');
    //console.log(thing);
    // console.log('------------------------------------');
    // thing.save()
    //   .then(() => {
    //    console.log('-------------res-----------------------');
    //    console.log("ok");
    //   console.log('------------------------------------');
    res.status(201).json({ message: 'Objet enregistré ! ' })


    //  })
    // .catch(error => res.status(400).json({ error }))
});

app.use('/api/auth/signup', (req, res, next) => {
    const signup = [
        {
            email: 'email',
            password: 'password',
        },

    ];
    res.status(200).json(signup);
});

app.use('/api/auth/login', (req, res, next) => {
    const signup = [
        {
            email: 'email',
            password: 'password',
        },

    ];
    res.status(200).json(signup);
});



app.use('/api/sauces', (req, res, next) => {
    const sauce = [{
        _id: 'eroimfgjlfh',
        name: 'Blair\'s Ultra Death Sauce',
        manufacturer: 'Blair\'s',
        description: 'Blair\'s Ultra Death has established itself as a bit of a legend within the hot sauce world.\n' +
            '\n' +
            'If there\'s one thing that creator Blair Lazar does well it\'s retaining the flavour in his super-hot sauces. They\'ll melt your face off for sure, but despite the extract they still taste damned fine.\n' +
            '\n' +
            'Just to emphasise the seriousness of the heat we\'re dealing with here, all Blair\'s super-hot sauces in the Death range now come in a nifty coffin box with his trademark skull keyring attached to the bottle.',
        heat: 9,
        likes: 100,
        dislikes: 0,
        imageUrl: 'https://www.chilliworld.com/content/images/thumbs/0000827_blairs-ultra-death-sauce-in-a-coffin_550.jpeg',
        mainPepper: 'Carolina Reaper',
        usersLiked: [],
        usersDisliked: []
    }]
    res.status(200).json(sauce);
    /* Thing.find()
         .then(things => res.status(200).json(things))
         .catch(error => res.status(400).json({ error }))*/
});

app.use('/api/sauces/:id', (req, res, next) => {
    const sauce = [{
        _id: 'eroimfgjlfh',
        name: 'Blair\'s Ultra Death Sauce',
        manufacturer: 'Blair\'s',
        description: 'Blair\'s Ultra Death has established itself as a bit of a legend within the hot sauce world.\n' +
            '\n' +
            'If there\'s one thing that creator Blair Lazar does well it\'s retaining the flavour in his super-hot sauces. They\'ll melt your face off for sure, but despite the extract they still taste damned fine.\n' +
            '\n' +
            'Just to emphasise the seriousness of the heat we\'re dealing with here, all Blair\'s super-hot sauces in the Death range now come in a nifty coffin box with his trademark skull keyring attached to the bottle.',
        heat: 9,
        likes: 100,
        dislikes: 0,
        imageUrl: 'https://www.chilliworld.com/content/images/thumbs/0000827_blairs-ultra-death-sauce-in-a-coffin_550.jpeg',
        mainPepper: 'Carolina Reaper',
        usersLiked: [],
        usersDisliked: []
    }]
    res.status(200).json(sauce);
    /* Thing.find()
         .then(things => res.status(200).json(things))
         .catch(error => res.status(400).json({ error }))*/
});
module.exports = app;