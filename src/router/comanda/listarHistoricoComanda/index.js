const { ListarHistoricoComanda } = require('../../../service/api/comanda'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/listar/historico/comanda Listar Histórico de Compras na Comanda
    * @apiSampleRequest http://93.188.164.122:3000/api/listar/historico/comanda
    * @apiName comanda_listar_historico
    * @apiGroup Comanda
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para listar o histórico de compra de produtos na comanda
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {string} comandaId ObjectId da comanda
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Array} retorno Array de objetos dos produtos comprados
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": true,
    *           "retorno": [
    *               {
    *                   "nomeProduto": "Porção de Batata Frita",
    *                   "iconProduto": "5da46cda540f2c3cd46cfdb3_5dc050d94b245a7cfd18b425.png",
    *                   "quantidade": 1,
    *                   "valorTotal": 20,
    *                   "createdAt": "11/11/2019 22:09"
    *               }
    *               ...
    *           ]
    *       }
    *
    * @apiErrorExample {json} Senha inválida:
    *     HTTP/1.1 401 Unauthorized
    *     {
    *       Unauthorized
    *     }
    * @apiErrorExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *    {
    *        "sucesso": false,
    *        "mensagem": "Mensagem de erro"
    *    }
**/

module.exports = () => (req, res) => {

    ListarHistoricoComanda(req.body.comandaId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarHistoricoComanda:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};