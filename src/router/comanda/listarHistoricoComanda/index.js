const { ListarHistoricoComanda } = require('../../../service/api/comanda'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    ListarHistoricoComanda(req.body.comandaId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarHistoricoComanda:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};