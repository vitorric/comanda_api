const { RecuperarSenha } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    RecuperarSenha(req.body.email).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in RecuperarSenha:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.USUARIO_NAO_ENCONTRADO);
        });
};