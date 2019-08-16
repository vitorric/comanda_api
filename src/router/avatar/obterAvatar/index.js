const { ObterAvatar } = require('../../../service/api/avatar'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    ObterAvatar(req.body.avatarId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterAvatar:', error);
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        });
};