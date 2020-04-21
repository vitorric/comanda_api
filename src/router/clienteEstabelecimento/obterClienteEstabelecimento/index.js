const { ObterClienteEstabelecimento } = require('../../../service/api/clienteEstabelecimento'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    ObterClienteEstabelecimento(req.body.clienteId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error)  => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterClienteEstabelecimento:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};