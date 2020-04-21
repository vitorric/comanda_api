const { ListarClientesEstabelecimento } = require('../../../service/api/clienteEstabelecimento'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    ListarClientesEstabelecimento(req.user.estabelecimentoId, req.body.nome).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error)  => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarClientesEstabelecimento:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};