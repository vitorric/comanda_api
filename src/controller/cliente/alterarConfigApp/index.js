const { alterarClienteConfigApp } =  require('../../../repository/api/cliente'),
    { resJsonP } = require('../../../utils');


module.exports = () => (req, res) => {

    let cliente = req.body;

    if (!cliente._idCliente ||
        !cliente.configApp)
    {
        // eslint-disable-next-line no-undef
        resJsonP(res, 200, false, {mensagem: Mensagens.CLIENTE_ALTERAR_CONFIG_ERRO});
        return;
    }

    let configApp = (typeof cliente.configApp === 'object') ? cliente.configApp : JSON.parse(cliente.configApp);

    if (!configApp.somFundo ||
        !configApp.somGeral)
    {
        // eslint-disable-next-line no-undef
        resJsonP(res, 200, false, {mensagem: Mensagens.CLIENTE_ALTERAR_CONFIG_ERRO});
        return;
    }

    alterarClienteConfigApp(cliente._idCliente, configApp.somFundo, configApp.somGeral).then((result) => resJsonP(res, 200, true, result)).catch((err) => resJsonP(res, 200, false, err.message));
};