const { ListarHistoricoCompra } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/listar/cliente/historico/compra Histórico Compra
    * @apiSampleRequest http://93.188.164.122:3000/api/listar/cliente/historico/compra
    * @apiName cliente_historico_compra
    * @apiGroup Cliente
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para listar os histórico de compras dos clientes dentro das loja do aplicativo
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
    *                   "_id": "5ce74c7b4b594e36a01daaec",
    *                   "infoEntrega": {
    *                       "jaEntregue": false
    *                   },
    *                   "estabelecimento": {
    *                       "nome": "Ravicini"
    *                   },
    *                   "itemLoja": {
    *                       "nome": "Cerveja 01"
    *                   },
    *                   "precoItem": 150,
    *                   "chaveUnica": "DNO5BT",
    *                   "createdAt": "2019-05-24T01:44:27.491Z"
    *               },
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
    *         "mensagem": "Solicitação inválida, tente novamente!"
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