const firebase = require('firebase-admin');

module.exports = (() => {
    // Arquivo gerado pelo firebase
    let serviceAccount = require('./data/config.json');

    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
        databaseURL: 'URL_DO_FIREBASE'
    });

    return firebase;
})();
