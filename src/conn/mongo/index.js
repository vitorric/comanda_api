const mongoose = require('mongoose');
const config = require('../../../config/bd');

let name = 'dev';

//mongoose.Promise = Promise;
let options = {
    keepAlive: 300000,
    connectTimeoutMS: 0,
    reconnectTries: 30,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    bufferMaxEntries: 0,
    poolSize: 5,
    reconnectInterval: 500
};

const mongoUrl = `mongodb://${config[name].MONGO_USER}:${config[name].MONGO_PWD}@${config[name].MONGO_HOST}:${config[name].MONGO_PORT}/${config[name].MONGO_DB}?authSource=${config[name].MONGO_AUTH_SOURCE}&authMechanism=SCRAM-SHA-1`;

const db = mongoose.createConnection(mongoUrl, options);

db.once('connected', () => {
    console.log('Mongodb connection', name);
    return db;
});

db.on('disconnected', () => {
    console.log('connection disconnected');
});

db.on('error', (err) => {
    console.log('Error in mongodb connection: ', err);

});

module.exports = db;

