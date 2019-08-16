const passport = require('passport'),
    passportEstabelecimentoJWT = passport.authenticate('estabelecimentoAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {

    router.post('/download/desafio/icon', passportEstabelecimentoJWT, require('./downloadIconDesafio')());

    return router;
};