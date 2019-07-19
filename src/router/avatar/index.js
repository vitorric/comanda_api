const passport = require('passport'),
    passportJWT = passport.authenticate('clienteAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {

    router.post('/alterar/cliente/avatar',passportJWT, require('./alterarAvatar')());

    router.post('/obter/cliente/avatar',passportJWT, require('./obterAvatar')());

    router.post('/alterar/cliente/avatar/exp',passportJWT, require('./alterarExp')());

    return router;
};