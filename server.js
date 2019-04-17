const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    i18n = require('i18n'),
    app = express();

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'Content-type, Accept, Authorization');

    console.log('IP: ', req.connection.remoteAddress);

    next();
});

require('./src/conn/mongo');

/**
 * @description inicia o modulo de passaport jwt
 */
require('./src/service/passaport')();


/**
 * @description inicia os servicos de mongo watch
 */
//require('./src/service/watch').iniciarWatch();

i18n.configure({
    locales: ['br', 'en'],

    directory: __dirname + '/locales',
    register: global,
});

app.use(
    i18n.init,
    morgan('dev'),
    bodyParser.json({ limit: '1000MB' }),
    bodyParser.urlencoded({ extended: true })
);

require('./src/router')(app);

app.set('port', 3000);

module.exports = app;