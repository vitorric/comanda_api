const passport = require('passport'),
    passportEstabelecimentoJWT = passport.authenticate('estabelecimentoAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {

    //Estabelecimento
    router.post('/cadastrar/clienteestabelecimento', passportEstabelecimentoJWT, require('./cadastrarClienteEstabelecimento')());

    router.post('/listar/clienteestabelecimento', passportEstabelecimentoJWT, require('./listarClientesEstabelecimento')());

    router.post('/obter/clienteestabelecimento', passportEstabelecimentoJWT, require('./obterClienteEstabelecimento')());

    router.post('/alterar/clienteestabelecimento', passportEstabelecimentoJWT, require('./alterarClienteEstabelecimento')());

    return router;
};