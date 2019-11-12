const passport = require('passport'),
    passportJWTCliente = passport.authenticate('clienteAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {

    router.post('/validar/gps/cliente',passportJWTCliente, require('./validarClientePertoEstabelecimento')());

    return router;
};