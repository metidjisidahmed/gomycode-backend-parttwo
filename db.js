// Requiring firebase (as our db)
var admin = require("firebase-admin");
var serviceAccount =require("admin.json")
const db =admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
// // Importing our configuration to initialize our app
// const config = require('./firebaseConfigs');
// const serviceAccount = require("./admin.json");
// // Creates and initializes a Firebase app instance. Pass options as param
// const db = firebase.initializeApp(config.firebaseConfig);

module.exports = db;
