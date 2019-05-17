const { CadastrarCliente } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {
    CadastrarCliente(req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        // eslint-disable-next-line no-undef
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarClienteConfigApp:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.CLIENTE_CADASTRAR_ERRO);
        });
};