const { ObterProduto } = require('../../../service/api/produto'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    ObterProduto(req.body.produtoId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
    // eslint-disable-next-line no-undef
        .catch((error)  => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterProduto:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};