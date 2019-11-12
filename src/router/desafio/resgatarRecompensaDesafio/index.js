const { ResgatarRecompensaDesafio } = require('../../../service/api/desafio'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    ResgatarRecompensaDesafio(req.body.desafioId, req.user.clienteId, req.body.ganhouPremioProduto).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ResgatarRecompensaDesafio:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });

};