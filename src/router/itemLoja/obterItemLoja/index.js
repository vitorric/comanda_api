const { ObterItemLoja } = require('../../../service/api/itemLoja'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    ObterItemLoja(req.user.estabelecimentoId, req.body.itemId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterItemLoja:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};