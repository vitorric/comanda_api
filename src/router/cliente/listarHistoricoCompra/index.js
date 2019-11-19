const { ListarHistoricoCompra } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/listar/cliente/historico/compra Histórico de Itens Ganhados/Comprados
    * @apiSampleRequest http://93.188.164.122:3000/api/listar/cliente/historico/compra
    * @apiName cliente_historico_compra
    * @apiGroup Cliente
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para listar os histórico de compras de itens loja e de produtos ganhos em desafios
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Array} retorno Array de objetos de histórico de compras do cliente
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
    *                   "_id": "5dc438a10014be15ce65c30f",
    *                   "infoEntrega": {
    *                       "jaEntregue": false,
    *                       "dataEntrega": null
    *                   },
    *                   "quantidade": 1,
    *                   "estabelecimento": {
    *                       "nome": "Torremos"
    *                   },
    *                   "itemLoja": {
    *                       "nome": "Breja de Batatinha"
    *                   },
    *                   "modoObtido": "Compra",
    *                   "chaveUnica": "PVEPIX",
    *                   "precoItem": 25,
    *                   "createdAt": "07/11/2019 12:30"
    *               },
    *               {
    *                   "_id": "5daf9efd0a6dc34f64b9881d",
    *                   "infoEntrega": {
    *                       "jaEntregue": false,
    *                       "dataEntrega": null
    *                   },
    *                   "quantidade": 10,
    *                   "estabelecimento": {
    *                       "nome": "Torremos"
    *                   },
    *                   "produto": {
    *                       "nome": "Cerveja de Batata",
    *                       "icon": "5da46cda540f2c3cd46cfdb3_5dae49ec5f54283e4a82690c.png"
    *                   },
    *                   "modoObtido": "Desafio",
    *                   "chaveUnica": "ZH4JEW",
    *                   "precoItem": 0,
    *                   "createdAt": "22/10/2019 21:29"
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
    *         "mensagem": "Mensagem Erro"
    *     }
**/
module.exports = () => (req, res) =>
{
    ListarHistoricoCompra(req.user.clienteId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarHistoricoCompra:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};