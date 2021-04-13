const express = require('express'); //import framwork de nodejs
const bodyParser = require('body-parser') // extrair l'objet JSON des req Post 
const mongoose = require('mongoose');// conexion a la data base de Mongo Db
const path = require('path'); // donne accés au chemin de nos systeme de fichier


const helmet = require('helmet');
// utilisation de 'helmet' pour la protectioin certaines vulnérabilités
//requêtes HTTP, sécurise les en-têtes, contrôle la prélecture DNS du navigateur, empêche le détournement de clics
// une protection XSS  et protège contre le reniflement de TYPE MIME

const cookie = require('cookie-session')// utilisation du modul cookie session pour améliorer la securiter de ceux-ci

const stuffRoutes = require('./routes/stuff') //import des routes sauces
const userRoutes = require('./routes/user');//import des routes user

require('dotenv').config(); // module 'dotenv' pour masquer les informations de connexion à la base de données 


mongoose.connect(process.env.DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !')); // conexion a la base de donné de mongoose


const app = express(); // utilisation de expresse pour le site



app.use((req, res, next) => {// contourne les certaine erreurs CORS pour que tous le monde puisse faire des requetes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

let expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 heur
app.use(cookie({
    name: 'session',
    secret: "monsecret",
    cookie: {
        secure: true,
        httpOnly: true,
        domain: 'http://localhost:3000',
        expires: expiryDate
    }
}))



//Avec une attaque XSS, un attaquant va essayer de prendre le contrôle de votre navigateur en injectant un script JavaScript dans l'application web. 
//Il pourra l’injecter directement dans un formulaire, mais il peut également l’injecter dans l'URL, l'en-tête HTTP ou d'autres parties du framework utilisé.
//Contrairement aux injections SQL, il ne s'agit pas de requêtes et de commandes SQL sur une base de données. Une faille XSS s’exécute dans le code de l'application web. 
//Revenons à la page de connexion avec le nom d'utilisateur et le mot de passe. Au lieu du nom d'utilisateur, le pirate va entrer :


app.use(bodyParser.json())//middleware qui permet de parse les requetes post en objet JSON
app.use(helmet());// mise en place du X-XSS-Protection afin d'activer le filtre de script intersites(XSS) dans les navigateurs 
app.use('/images', express.static(path.join(__dirname, 'images')));// charger le fichier que ce trouve dans le doc images
app.use('/api/sauces', stuffRoutes)//route sauces

app.use('/api/auth', userRoutes);// route user
app.use('*', (req, res) => { res.json({ error: 404 }) })
module.exports = app;// exporte express pour le server.js