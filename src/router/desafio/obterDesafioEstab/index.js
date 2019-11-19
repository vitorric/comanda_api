const { ObterDesafioEstab } = require('../../../service/api/desafio'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/obter/desafio Obter Desafio Estabelecimento
    * @apiSampleRequest http://93.188.164.122:3000/api/obter/desafio
    * @apiName desafio_obter_desafio_estabelecimento
    * @apiGroup Desafio_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota que se obtém as informações de um desafio do estabelecimento
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
    *               "_id": "5dc206495b85ca5b7cf23aa8",
    *               "emGrupo": false,
    *               "status": 1,
    *               "nome": "Desafio Teste Notificacao",
    *               "descricao": "Consuma R$ 50,00 e ganhe 100 CPGold",
    *               "tempoDuracao": "2019-11-09T23:30:00.000Z",
    *               "tempoEntrarNoAr": "2019-11-05T23:30:49.695Z",
    *               "premio": {
    *                   "tipo": "CPGold",
    *                   "quantidade": 100
    *               },
    *               "objetivo": {
    *                   "tipo": "Dinheiro",
    *                   "quantidade": 50
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

    ObterDesafioEstab(req.user.estabelecimentoId, req.body.desafioId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterDesafioEstab:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });

};