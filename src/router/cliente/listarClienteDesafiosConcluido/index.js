const { ListarClienteDesafiosConcluidos } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/listar/cliente/desafios/concluido Listar Desafios Concluídos
    * @apiSampleRequest http://93.188.164.122:3000/api/listar/cliente/desafios/concluido Listar Desafios Concluídos
    * @apiName cliente_listar_desafio_concluido
    * @apiGroup Cliente
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Lista os desafios concluído do Cliente
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Object} retorno  Array de Objetos que contém as informações dos desafios do cliente concluído
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": true,
    *           "retorno": {
    *                   "desafios": [
    *                       {
    *                           "_id": "5dba3830b42ff73a60956c1e",
    *                           "desafio": {
    *                               "_id": "5dae4c5f5f54283e4a82690d",
    *                               "nome": "Consumir Cerveja de Batata em Grupo",
    *                               "descricao": "Consuma 1 Cerveja de Batata e ganhe 1",
    *                               "objetivo": {
    *                                   "tipo": "Produto",
    *                                   "quantidade": 1,
    *                                   "produto": {
    *                                       "_id": "5dae49ec5f54283e4a82690c",
    *                                       "nome": "Cerveja de Batata",
    *                                       "icon": "5da46cda540f2c3cd46cfdb3_5dae49ec5f54283e4a82690c.png"
    *                                   }
    *                               },
    *                               "icon": "5da46cda540f2c3cd46cfdb3_5dae4c5f5f54283e4a82690d.png"
    *                           }
    *                       }
    *                       ...
    *                   ]
    *               }
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
    *           "sucesso": false,
    *           "mensagem": "Mensagem erro"
    *       }
**/

module.exports = () => (req, res) =>
{
    ListarClienteDesafiosConcluidos(req.user.clienteId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarClienteDesafiosConcluidos:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};