const { CadastrarDesafio } = require('../../../service/api/desafio'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    CadastrarDesafio(req.user.estabelecimentoId, req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarDesafio:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });

};