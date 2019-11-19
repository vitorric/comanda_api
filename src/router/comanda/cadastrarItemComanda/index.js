const { CadastrarItemComanda } = require('../../../service/api/comanda'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/cadastrar_item/comanda Cadastrar Produtos na Comanda
    * @apiSampleRequest http://93.188.164.122:3000/api/cadastrar_item/comanda
    * @apiName comanda_cadastrar_produto
    * @apiGroup Comanda_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Cadastra um produto na comanda de um cliente
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} comandaId ObjectId da comanda
    * @apiParam {String} produto ObjectId do produto
    * @apiParam {int} quantidade Quantidade que será adicionada
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Object} retorno Objeto que contém informações da comanda após a adição do item
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem  Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": true,
    *           "retorno": {
    *               "valorTotal": 20,
    *               "produtosComanda": {
    *                   "_id": "5dca051dec985f533467743f",
    *                   "produtos": [
    *                       {
    *                           "quantidade": 1,
    *                           "_id": "5dca065dff5f2a4ce09a7692",
    *                           "preco": 20,
    *                           "precoTotal": 20,
    *                           "produto": {
    *                               "_id": "5dc050d94b245a7cfd18b425",
    *                               "nome": "Porção de Batata Frita",
    *                               "icon": "5da46cda540f2c3cd46cfdb3_5dc050d94b245a7cfd18b425.png"
    *                           }
    *                       }
    *                   ]
    *               }
    *           }
    *       }
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

    CadastrarItemComanda(req.user.estabelecimentoId, req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarItemComanda:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};