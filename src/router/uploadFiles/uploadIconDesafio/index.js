const { UploadIconDesafio } = require('../../../service/api/uploadFiles'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    UploadIconDesafio(req.user.estabelecimentoId, req.body.desafioId, req.files.file).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error)  => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in UploadIconDesafio:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};