const passport = require('passport'),
    passportEstabelecimentoJWT = passport.authenticate('estabelecimentoAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {

    router.post('/cadastrar/itemLoja', passportEstabelecimentoJWT, require('./cadastrarItemLoja')());

    router.post('/alterar/itemLoja', passportEstabelecimentoJWT, require('./alterarItemLoja')());

    router.post('/alterar/itemLoja/status', passportEstabelecimentoJWT, require('./alterarItemLojaStatus')());

    router.post('/listar/itemLoja', passportEstabelecimentoJWT, require('./listarItemLoja')());

    router.post('/obter/itemLoja', passportEstabelecimentoJWT, require('./obterItemLoja')());

    return router;
};