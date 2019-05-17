const { AlterarCliente } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {
    AlterarCliente(req.user.clienteId, req.body).then((result) => resJsonP(res, 200, result.status))
    // eslint-disable-next-line no-undef
        .catch(() => resJsonP(res, 200, false, null, Mensagens.CLIENTE_CADASTRAR_ERRO));
};
