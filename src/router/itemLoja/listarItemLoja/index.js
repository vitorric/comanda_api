const { ListarItemLoja } = require('../../../service/api/itemLoja'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    ListarItemLoja(req.user.estabelecimentoId, req.body.nome).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarItemLoja:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};