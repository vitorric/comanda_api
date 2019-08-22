const passport = require('passport'),
    passportEstabelecimentoJWT = passport.authenticate('estabelecimentoAuth', {session:false}),
    passportClienteJWT = passport.authenticate('clienteAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {

    router.post('/cadastrar/comanda', passportEstabelecimentoJWT, require('./cadastrarComanda')());

    router.post('/listar/comandas', passportEstabelecimentoJWT, require('./listarComandaEstab')());

    router.post('/obter/comanda', passportEstabelecimentoJWT, require('./obterComandaEstab')());

    router.post('/convidar/membro_grupo/comanda', passportClienteJWT, require('./enviarConviteGrupo')());

    router.post('/cancelar_convite/membro_grupo/comanda', passportClienteJWT, require('./cancelarConviteGrupo')());

    router.post('/resposta_convite/membro_grupo/comanda', passportClienteJWT, require('./respostaConviteGrupo')());

    router.post('/cadastrar_item/comanda', passportEstabelecimentoJWT, require('./cadastrarItemComanda')());

    router.post('/listar/convites/enviados',passportClienteJWT, require('./listarConvitesComandaEnviados')());

    router.post('/listar/historico/comanda',passportClienteJWT, require('./listarHistoricoComanda')());

    router.post('/transferir/lideranca/comanda',passportClienteJWT, require('./transferirLiderancaGrupo')());

    router.post('/cliente/pagar/comanda',passportEstabelecimentoJWT, require('./clientePagarComanda')());

    return router;
};