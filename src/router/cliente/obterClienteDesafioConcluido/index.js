const { ObterClienteDesafioConcluido } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/obter/cliente/desafios/concluido Obter Desafio Concluido Cliente
    * @apiSampleRequest http://93.188.164.122:3000/api/obter/cliente/desafios/concluido
    * @apiName cliente_obter_desafio_concluido
    * @apiGroup Cliente
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Obtém um desafio concluído pelo cliente
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} desafioId ObjectId do desafio
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Object} retorno Objeto que contém as informações do cliente
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
    *               "_id": "5dc21073fed7b1592cf2b254",
    *               "desafio": {
    *                   "_id": "5dc206495b85ca5b7cf23aa8",
    *                   "nome": "Desafio Teste Notificacao",
    *                   "descricao": "Consuma R$ 50,00 e ganhe 100 CPGold",
    *                   "objetivo": {
    *                       "tipo": "Dinheiro",
    *                       "quantidade": 50
    *                   }
    *               },
    *               "estabelecimento": {
    *                   "_id": "5da46cda540f2c3cd46cfdb3",
    *                   "nome": "Torremos"
    *               },
    *               "premio": {
    *                   "tipo": "CPGold",
    *                   "quantidade": 100
    *               },
    *               "dataConclusao": "05/11/2019 21:14"
    *           }
    *
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
    *           "mensagem": "Mensagem de erro"
    *       }
**/

module.exports = () => (req, res) => {
    ObterClienteDesafioConcluido(req.user.clienteId, req.body.desafioId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterClienteDesafioConcluido:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};