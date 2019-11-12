const { ValidarClientePertoEstabelecimento } = require('../../../service/api/gps'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    ValidarClientePertoEstabelecimento(req.body.estabelecimentoId, req.body.coordenadas).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ValidarClientePertoEstabelecimento:', error);
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        });
};