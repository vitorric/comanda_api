const db = require('../../conn'),
    { updateFBCliente } = require('./firebase');

exports.iniciarWatch = () => {
    db.on('open', () => {
        const taskCollection = db.collection('cliente');
        // const changeStream = taskCollection.watch();

        // changeStream.on('change', (change) => updateFBCliente(change));
    });
};
