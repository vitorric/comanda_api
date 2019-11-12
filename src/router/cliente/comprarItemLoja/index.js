const { ComprarItemLoja } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    /**
        * @api {post} http://93.188.164.122:3000/api/comprar_item/cliente Comprar Item Loja
        * @apiSampleRequest http://93.188.164.122:3000/api/comprar_item/cliente
        * @apiName cliente_comprar_item_loja
        * @apiGroup Cliente
        *
        * @apiVersion 1.0.0
        *
        * @apiDescription Quando o cliente compra algum item de um estabelecimento com o dinheiro virtual do aplicativo
        *
        * @apiHeader Authorization Bearer Authentication token.
        * @apiHeaderExample {json} Header-Example:
        *     {
        *       content-type: 'application/json',
        *       Authorization: 'Bearer authentication'
        *     }
        *
        * @apiParam {string} estabelecimento ObjectId do estabelecimento
        * @apiParam {string} itemLoja ObjectId do item do estabelecimento
        * @apiParam {int} precoItem Valor do item
        *
        * @apiSuccess {Boolean} sucesso <code>true</code>
        * @apiSuccess {string} retorno código unico da compra, usado para retirada do produto físico
        *
        * @apiError {Boolean} sucesso <code>false</code>
        * @apiError {string} mensagem Mensagem contendo o problema
        *
        *
        * @apiSuccessExample {json} Success-Response:
        *     HTTP/1.1 200 OK
        *       {
        *           "sucesso": true,
        *           "retorno": "EMNS0A"
        *       }
        *
        * @apiErrorExample {json} Senha inválida:
        *     HTTP/1.1 401 Unauthorized
        *     {
        *       Unauthorized
        *     }
        * @apiErrorExample {json} Success-Response:
        *     HTTP/1.1 200 OK
        *       {
        *           "sucesso": false,,
        *           "mensagem": "Mensagem erro"
        *       }
    **/

    ComprarItemLoja(req.user.clienteId, req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ComprarItemLoja:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};