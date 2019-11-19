const { ObterItemLoja } = require('../../../service/api/itemLoja'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/obter/itemLoja Obter Item Loja
    * @apiSampleRequest http://93.188.164.122:3000/obter/itemLoja
    * @apiName itemLoja_obter
    * @apiGroup ItemLoja_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para obter informações do item da loja
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} itemId ObjectId do Item Loja
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Object} retorno Objeto que contém as informações do item loja
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
    *               "_id": "5dc21183fed7b1592cf2b258",
    *               "preco": 25,
    *               "status": 1,
    *               "quantidadeVendida": 3,
    *               "hotSale": false,
    *               "quantidadeDisponivel": 97,
    *               "produto": {
    *                   "_id": "5dae49ec5f54283e4a82690c",
    *                   "codigo": 1000,
    *                   "nome": "Cerveja de Batata"
    *               },
    *               "tempoDisponivel": "2019-11-24T00:18:00.000Z",
    *               "tempoEntrarNoAr": "2019-11-06T00:18:37.381Z",
    *               "nome": "Breja de Batatinha",
    *               "descricao": "Cerveja de batata? É isso mesmo meu brodi, compre isso e experimente essa delicia."
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

    ObterItemLoja(req.user.estabelecimentoId, req.body.itemId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterItemLoja:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};