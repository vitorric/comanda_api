const { ListarProdutos } = require('../../../service/api/produto'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/listar/produto Listar Itens Loja
    * @apiSampleRequest http://93.188.164.122:3000/listar/produto
    * @apiName produto_listar
    * @apiGroup Produto_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para listar os produtos físicos de um estabelecimento
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Array} retorno Array de objetos dos produtos do estabelecimento
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem  Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": true,
    *           "retorno": [
    *               {
    *                   "_id": "5dae49ec5f54283e4a82690c",
    *                   "custo": 10,
    *                   "estoque": 467,
    *                   "quantidadeVendida": 210,
    *                   "preco": 17,
    *                   "status": 1,
    *                   "codigo": 1000,
    *                   "nome": "Cerveja de Batata",
    *                   "descricao": "Cerveja com sabor de batata",
    *                   "estabelecimento": "5da46cda540f2c3cd46cfdb3",
    *                   "createdAt": "2019-10-22T00:14:36.719Z",
    *                   "updatedAt": "2019-11-06T00:14:48.738Z",
    *                   "__v": 0,
    *                   "icon": "5da46cda540f2c3cd46cfdb3_5dae49ec5f54283e4a82690c.png"
    *               },
    *               {
    *                   "_id": "5dc050d94b245a7cfd18b425",
    *                   "custo": 6,
    *                   "estoque": 17,
    *                   "quantidadeVendida": 3,
    *                   "preco": 20,
    *                   "status": 1,
    *                   "codigo": 1,
    *                   "nome": "Porção de Batata Frita",
    *                   "descricao": "Porção de Batata Frita",
    *                   "estabelecimento": "5da46cda540f2c3cd46cfdb3",
    *                   "createdAt": "2019-11-04T16:24:57.934Z",
    *                   "updatedAt": "2019-11-12T01:09:50.987Z",
    *                   "__v": 0,
    *                   "icon": "5da46cda540f2c3cd46cfdb3_5dc050d94b245a7cfd18b425.png"
    *               }
    *           ]
    *           ...
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

    ListarProdutos(req.user.estabelecimentoId, req.body.nome).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error)  => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarProdutos:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};