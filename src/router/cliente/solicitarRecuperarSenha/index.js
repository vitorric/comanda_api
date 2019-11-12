const { SolicitarRecuperarSenha } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {
    SolicitarRecuperarSenha(req.body.email).then((result) => resJsonP(res, 200, result.status, null, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in SolicitarRecuperarSenha:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};