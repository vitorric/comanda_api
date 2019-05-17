const { AlterarClienteConfigApp } =  require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');


module.exports = () => (req, res) => {

    AlterarClienteConfigApp(req.user.clienteId, req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarClienteConfigApp:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.CLIENTE_ALTERAR_CONFIG_ERRO);
        });
};