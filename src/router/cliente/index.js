const passport = require('passport'),
    passportClienteJWT = passport.authenticate('clienteAuth', {session:false}),
    passportEstabelecimentoJWT = passport.authenticate('estabelecimentoAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {

    router.post('/validar/cadastrar/cliente/cpf', require('./validarCadastroCPF')());

    router.post('/validar/cadastrar/cliente/apelido', require('./validarCadastroApelido')());

    router.post('/validar/cadastrar/cliente/email', require('./validarCadastroEmail')());

    router.post('/cadastrar/cliente', require('./cadastrarCliente')());

    router.post('/alterar_config_app/cliente',passportClienteJWT, require('./alterarConfigApp')());

    router.post('/entrar_estabelecimento/cliente',passportClienteJWT, require('./entrarNoEstabelecimento')());

    router.post('/sair_estabelecimento/cliente',passportClienteJWT, require('./sairDoEstabelecimento')());

    router.post('/recusar_convite_estabelecimento/cliente',passportClienteJWT, require('./recusarConviteEstabelecimento')());

    router.post('/alterar/cliente', passportClienteJWT, require('./alterarCliente')());

    router.post('/login/cliente', passport.authenticate('cliente', {session: false}), require('./login')());

    router.post('/deslogar/cliente', passportClienteJWT, require('./deslogarCliente')());

    router.post('/login/facebook', require('./loginFacebook')());

    router.post('/recuperar_senha/cliente', passportClienteJWT, require('./recuperarSenha')());

    router.post('/solicitar/recuperar_senha', require('./solicitarRecuperarSenha')());

    router.post('/comprar_item/cliente', passportClienteJWT, require('./comprarItemLoja')());

    router.get('/listar/cliente',passportClienteJWT, require('./listarClientes')());

    router.post('/listar/cliente/historico/compra',passportClienteJWT, require('./listarHistoricoCompra')());

    router.post('/listar/cliente/desafios/concluido',passportClienteJWT, require('./listarClienteDesafiosConcluido')());

    router.post('/obter/cliente/desafios/concluido',passportClienteJWT, require('./obterClienteDesafioCliente')());

    router.post('/obter/cliente/chave_unica',passportEstabelecimentoJWT, require('./obterClienteChaveUnica')());

    return router;
};