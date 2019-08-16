const { MarcarMensagemComoLida } = require('../../../service/api/correio'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    MarcarMensagemComoLida(req.user.clienteId, req.body.mensagemId).then((result) => resJsonP(res, 200, result.status, null, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in MarcarMensagemComoLida:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};