const { AlterarStatusEntregaItem } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/estabelecimento/entrega/item Entregar Item
    * @apiSampleRequest http://93.188.164.122:3000/api/estabelecimento/entrega/item
    * @apiName estabelecimento_entregar_item
    * @apiGroup Estabelecimento_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para informar que estabelecimento entregou o produto fisicamente ao cliente
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} historicId ObjectId do histórico de compra
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Object} retorno Objeto que contém informações da entrega
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem  Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *         "sucesso": true,
    *          "retorno": {
    *              "_id": "5daf9efd0a6dc34f64b9881d",
    *              "infoEntrega": {
    *                  "dataEntrega": "12/11/2019 21:41"
    *              }
    *          }
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
    AlterarStatusEntregaItem(req.body.historicoCompraId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarStatusEntregaItem:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};