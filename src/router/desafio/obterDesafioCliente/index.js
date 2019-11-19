const { ObterDesafioCliente } = require('../../../service/api/desafio'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/obter/desafio/cliente Obter Desafio Cliente
    * @apiSampleRequest http://93.188.164.122:3000/api/obter/desafio/cliente
    * @apiName desafio_obter_desafio_cliente
    * @apiGroup Desafio
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota que se obtém as informações de um desafio do cliente
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
    * @apiSuccess {Object} retorno Objeto que contém as informações da comanda
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
    *              "premio": {
    *                   "tipo": "CPGold",
    *                   "quantidade": 100
    *               },
    *               "objetivo": {
    *                   "tipo": "Dinheiro",
    *                   "quantidade": 50
    *               },
    *               "emGrupo": false,
    *               "statusFirebase": 2,
    *               "status": 1,
    *               "_id": "5dc206495b85ca5b7cf23aa8",
    *               "nome": "Desafio Teste Notificacao",
    *               "descricao": "Consuma R$ 50,00 e ganhe 100 CPGold",
    *               "tempoDuracao": "2019-11-09T23:30:00.000Z",
    *               "tempoEntrarNoAr": "2019-11-05T23:30:49.695Z",
    *               "estabelecimento": "5da46cda540f2c3cd46cfdb3",
    *               "createdAt": "2019-11-05T23:31:21.021Z",
    *               "updatedAt": "2019-11-09T23:30:00.011Z",
    *               "__v": 0
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

    ObterDesafioCliente(req.body.desafioId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterDesafioCliente:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });

};