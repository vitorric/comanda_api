const { LoginCliente } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    LoginCliente(req.user).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in LoginCliente:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.LOGIN_NAO_ENCONTRADO);
        });
};
