const { ObterClienteDesafioConcluido } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {
    ObterClienteDesafioConcluido(req.user.clienteId, req.body.desafioId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterClienteDesafioConcluido:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};