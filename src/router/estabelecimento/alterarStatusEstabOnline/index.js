const { AlterarStatusEstabOnline } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    AlterarStatusEstabOnline(req.user.estabelecimentoId, req.body.status).then((result) => resJsonP(res, 200, result.status))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarStatusEstabOnline:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });

};
