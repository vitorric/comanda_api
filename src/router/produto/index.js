const passport = require('passport'),
    passportEstabelecimentoJWT = passport.authenticate('estabelecimentoAuth', {session:false}),
    passportJWTCliente = passport.authenticate('clienteAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {

    //Cliente
    router.post('/obter/produto/cliente', passportJWTCliente, require('./obterProdutoCliente')());

    //Estabelecimento
    router.post('/cadastrar/produto', passportEstabelecimentoJWT, require('./cadastrarProduto')());

    router.post('/listar/produto', passportEstabelecimentoJWT, require('./listarProduto')());

    router.post('/obter/produto', passportEstabelecimentoJWT, require('./obterProduto')());

    router.post('/alterar/produto', passportEstabelecimentoJWT, require('./alterarProduto')());

    return router;
};