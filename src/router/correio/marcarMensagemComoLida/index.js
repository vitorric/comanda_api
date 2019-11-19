const { MarcarMensagemComoLida } = require('../../../service/api/correio'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/correio/mensagem_lida Marcar Mensagem Lida
    * @apiSampleRequest http://93.188.164.122:3000/api/correio/mensagem_lida
    * @apiName correio_mensagem_lida
    * @apiGroup Correio
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota marcar que um cliente leu a mensagem do correio
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {string} mensagemId ObjectId da comanda
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": true
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
    *           "mensagem": "Mensagem de erro"
    *       }
**/

module.exports = () => (req, res) => {

    MarcarMensagemComoLida(req.user.clienteId, req.body.mensagemId).then((result) => resJsonP(res, 200, result.status, null, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in MarcarMensagemComoLida:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};