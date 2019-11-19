const { DeslogarCliente } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/deslogar/cliente Deslogar Cliente
    * @apiSampleRequest http://93.188.164.122:3000/api/deslogar/cliente
    * @apiName cliente_deslogar
    * @apiGroup Cliente
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Desloga o cliente do aplicativo, removendo o token do firebase que esta no banco e ligado ao device do mesmo
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {string} deviceId hash de identificação do aparelho mobile
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
    *           "sucesso": false,,
    *           "mensagem": "Mensagem erro"
    *       }
**/

module.exports = () => (req, res) => {
    DeslogarCliente(req.body.deviceId, req.user.clienteId).then(result => resJsonP(res, 200, result.status, !result.msg ? result.resulObj : res.__(result.msg)))
        .catch(err => resJsonP(res, 200, false,null, res.__(err.message)));
};