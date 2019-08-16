const { ListarProdutos } = require('../../../service/api/produto'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    ListarProdutos(req.user.estabelecimentoId, req.body.nome).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error)  => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarProdutos:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};