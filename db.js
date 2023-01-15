// Requiring firebase (as our db)
const firebase = require('firebase');
// Importing our configuration to initialize our app
const config = require('./firebaseConfigs');
// Creates and initializes a Firebase app instance. Pass options as param
const db = firebase.initializeApp(config.firebaseConfig);

module.exports = db;
