const passport = require('passport'),
    passportClienteJWT = passport.authenticate('clienteAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {

    router.post('/correio/mensagem_lida', passportClienteJWT, require('./marcarMensagemComoLida')());

    return router;
};