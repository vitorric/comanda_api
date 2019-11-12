const { AlterarEstabelecimento } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    AlterarEstabelecimento(req.user.estabelecimentoId, req.body).then((result) => resJsonP(res, 200, result.status))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarEstabelecimento:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });

};
