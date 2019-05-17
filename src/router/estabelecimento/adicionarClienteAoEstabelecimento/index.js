const { AdicionarClienteAoEstabelecimento } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {
    AdicionarClienteAoEstabelecimento(req.user.estabelecimentoId, req.body.clienteId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in AdicionarClienteAoEstabelecimento:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.ESTABELECIMENTO_CLIENTE_ADICIONAR_ERRO);
        });
};