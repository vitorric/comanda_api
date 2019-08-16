const { ObterParaClientes } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    ObterParaClientes(req.body.estabelecimentoId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterParaClientes:', error);
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        });
};