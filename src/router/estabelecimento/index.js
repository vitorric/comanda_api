const passport = require('passport'),
    passportJWTEstabelecimento = passport.authenticate('estabelecimentoAuth', {session:false}),
    passportJWTCliente = passport.authenticate('clienteAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {

    router.post('/cadastrar/estabelecimento', require('./cadastrarEstabelecimento')());

    router.post('/login/estabelecimento', passport.authenticate('estabelecimento', {session: false}), require('./login')());

    router.post('/obter/estabelecimento', passportJWTEstabelecimento, require('./obterEstabelecimento')());

    router.post('/listar/estabelecimento/cliente',passportJWTCliente, require('./listarParaClientes')());

    router.post('/obter/estabelecimento/cliente',passportJWTCliente, require('./obterParaClientes')());

    router.post('/alterar/estabelecimento/online',passportJWTEstabelecimento, require('./alterarStatusEstabOnline')());

    router.post('/alterar/estabelecimento/entrega/item',passportJWTEstabelecimento, require('./alterarStatusEntregaItem')());

    router.post('/adicionar/estabelecimento/cliente',passportJWTEstabelecimento, require('./adicionarClienteAoEstabelecimento')());

    router.post('/adicionar/estabelecimento/itemloja',passportJWTEstabelecimento, require('./inserirItemNaLojaDoEstabelecimento')());

    router.post('/alterar/estabelecimento',passportJWTEstabelecimento, require('./alterarEstabelecimento')());

    router.post('/listar/estabelecimento/entrega/item', passportJWTEstabelecimento, require('./listarComprasParaEntregar')());

    return router;
};