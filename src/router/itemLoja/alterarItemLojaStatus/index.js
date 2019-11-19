const { AlterarItemLojaStatus } = require('../../../service/api/itemLoja'),
    { resJsonP } = require('../../../utils');


/**
    * @api {post} http://93.188.164.122:3000/api/alterar/itemLoja/status Alterar Item Loja Status
    * @apiSampleRequest http://93.188.164.122:3000/api/alterar/itemLoja/status
    * @apiName itemLoja_alterar_status
    * @apiGroup ItemLoja_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para alterar o item virtual da loja do estabelecimento
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} itemId ObjectId do item loja
    * @apiParam {Int} status Status do item loja
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem  Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *         "sucesso": true
    *     }
    *
    * @apiErrorExample {json} Senha inválida:
    *     HTTP/1.1 401 Unauthorized
    *     {
    *       Unauthorized
    *     }
    * @apiErrorExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *         "sucesso": false,
    *         "mensagem": "Mensagem de erro"
    *     }
**/

module.exports = () => (req, res) => {

    AlterarItemLojaStatus(req.user.estabelecimentoId, req.body).then((result) => resJsonP(res, 200, result.status, null, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarItemLojaStatus:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};