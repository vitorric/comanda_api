const { UploadIconProduto } = require('../../../service/api/uploadFiles'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    UploadIconProduto(req.user.estabelecimentoId, req.body.produtoId, req.files.file).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error)  => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in UploadIconProduto:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};