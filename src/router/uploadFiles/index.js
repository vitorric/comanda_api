const passport = require('passport'),
    passportEstabelecimentoJWT = passport.authenticate('estabelecimentoAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {

    router.post('/upload/desafio/icon', passportEstabelecimentoJWT, require('./uploadIconDesafio')());
    router.post('/upload/produto/icon', passportEstabelecimentoJWT, require('./uploadIconProduto')());
    router.post('/upload/item_loja/icon', passportEstabelecimentoJWT, require('./uploadIconItemLoja')());

    return router;
};