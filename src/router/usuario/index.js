const passport = require('passport'),
    passportJWT = passport.authenticate('usuarioAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {

    return router;
};