const { AlterarItemLoja } = require('../../../service/api/itemLoja'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    AlterarItemLoja(req.body).then((result) => resJsonP(res, 200, result.status, null, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarItemLoja:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};