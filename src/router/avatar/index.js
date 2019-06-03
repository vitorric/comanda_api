const passport = require('passport'),
    passportJWT = passport.authenticate('clienteAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {

    router.post('/alterar/cliente/avatar',passportJWT, require('./alterarAvatar')());

    return router;
};