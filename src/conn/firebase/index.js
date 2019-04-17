const firebase = require('firebase-admin');

module.exports = (() => {
    let serviceAccount = require('./data/comanda-3c059-firebase-adminsdk-lbax9-b0702c3305.json');

    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
        databaseURL: 'https://comanda-3c059.firebaseio.com'
    });

    return firebase;
})();