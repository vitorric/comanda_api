const { ListarItemLoja } = require('../../../service/api/itemLoja'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/listar/itemLoja Listar Itens Loja
    * @apiSampleRequest http://93.188.164.122:3000/listar/itemLoja
    * @apiName itemLoja_listar
    * @apiGroup ItemLoja_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para listar os itens da loja de um estabelecimento
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Array} retorno Array de objetos dos itens da loja virtual
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
    *                   "_id": "5dc21183fed7b1592cf2b258",
    *                   "preco": 25,
    *                   "status": 1,
    *                   "quantidadeVendida": 3,
    *                   "hotSale": false,
    *                   "quantidadeDisponivel": 97,
    *                   "produto": {
    *                       "_id": "5dae49ec5f54283e4a82690c",
    *                       "codigo": 1000,
    *                       "nome": "Cerveja de Batata"
    *                   },
    *                   "nome": "Breja de Batatinha",
    *                   "descricao": "Cerveja de batata? É isso mesmo meu brodi, compre isso e experimente essa delicia.",
    *                   "tempoDisponivel": "23/11/2019 21:18"
    *               },
    *               {
    *                   "_id": "5dcc83c81cbb85243c9f56b5",
    *                   "preco": 150,
    *                   "status": 1,
    *                   "quantidadeVendida": 0,
    *                   "hotSale": false,
    *                   "quantidadeDisponivel": 15,
    *                   "produto": {
    *                       "_id": "5dc050d94b245a7cfd18b425",
    *                       "codigo": 1,
    *                       "nome": "Porção de Batata Frita"
    *                   },
    *                   "nome": "Batata Frita",
    *                   "descricao": "Batatinha frita oleosa",
    *                   "tempoDisponivel": "13/11/2019 22:00"
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
    *     {
    *         "sucesso": false,
    *         "mensagem": "Mensagem de erro"
    *     }
**/

module.exports = () => (req, res) => {

    ListarItemLoja(req.user.estabelecimentoId, req.body.nome).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarItemLoja:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};