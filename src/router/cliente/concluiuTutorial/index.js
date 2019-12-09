const { ClienteConcluiuTutorial } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/alterar/concluiu/tutorial Alterar Concluiu Tutorial
    * @apiSampleRequest http://93.188.164.122:3000/api/alterar/concluiu/tutorial Alterar Concluiu Tutorial
    * @apiName cliente_alterar_concluiu_tutorial
    * @apiGroup Cliente
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para o cliente informar que concluiu o tutorial
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {string} tipoTutorial nome do tutorial que foi concluido
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem  Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": true
    *       }
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
    *           "mensagem": "Mensagem erro"
    *       }
**/

module.exports = () => (req, res) => {
    ClienteConcluiuTutorial(req.body.tipoTutorial, req.user.clienteId, req.user.avatarId).then((result) => resJsonP(res, 200, result.status))
        .catch(() => resJsonP(res, 200, false));
};
