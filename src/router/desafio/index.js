const passport = require('passport'),
    passportEstabelecimentoJWT = passport.authenticate('estabelecimentoAuth', {session:false}),
    passportClienteJWT = passport.authenticate('clienteAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {

    //Cliente
    router.post('/obter/desafio/cliente', passportClienteJWT, require('./obterDesafioCliente')());

    router.post('/resgatar/recompensa/desafio', passportClienteJWT, require('./resgatarRecompensaDesafio')());

    //Estabelecimento
    router.post('/cadastrar/desafio', passportEstabelecimentoJWT, require('./cadastrarDesafio')());

    router.post('/listar/desafios', passportEstabelecimentoJWT, require('./listarDesafiosEstab')());

    router.post('/obter/desafio', passportEstabelecimentoJWT, require('./obterDesafioEstab')());

    router.post('/alterar/desafio', passportEstabelecimentoJWT, require('./alterarDesafioEstab')());

    router.post('/alterar/desafio/status', passportEstabelecimentoJWT, require('./alterarDesafioEstabStatus')());

    return router;
};