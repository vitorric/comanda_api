
const { ListarConvitesComandaEnviados } = require('../../../service/api/comanda'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    ListarConvitesComandaEnviados(req.body.comandaId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
    // eslint-disable-next-line no-undef
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarConvitesComandaEnviados:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};