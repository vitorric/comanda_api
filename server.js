const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    i18n = require('i18n'),
    fileUpload = require('express-fileupload'),
    app = express();

app.use(fileUpload());
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'Content-type, Accept, Authorization');

    console.log('IP: ', req.connection.remoteAddress);

    next();
});

app.use(express.static(__dirname + '/public'));

require('./src/conn/mongo');

/**
 * @description inicia o modulo de passaport jwt
 */
require('./src/service/passaport')();

global.Mensagens = require('./locales/br.json');


/**
 * @description inicia o job que verifica a entrada de desafios, itens na loja e estabelecimentos aberto/fechado
 */
require('./src/service/cron').Job();

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