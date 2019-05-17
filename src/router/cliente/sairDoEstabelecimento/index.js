const { SairDoEstabelecimento } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    SairDoEstabelecimento(req.user.clienteId).then((result) => resJsonP(res, 200, result.status, null, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in SairDoEstabelecimento:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.CLIENTE_ERRO_ENTRAR_ESTABELECIMENTO);
        });

};