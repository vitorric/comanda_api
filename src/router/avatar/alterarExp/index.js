const { AlterarExp } = require('../../../service/api/avatar'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/alterar/cliente/avatar/exp Alterar Exp
    * @apiSampleRequest http://93.188.164.122:3000/api/alterar/cliente/avatar/exp
    * @apiName avatar_alterar_exp
    * @apiGroup Avatar
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para o cliente alterar a experência do avatar
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {string} clienteId  ObjectId do cliente
	* @apiParam {string} avatarId  ObjectId do avatar
	* @apiParam {int} exp Quantidade de exp que irá aumentar
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
    *           "mensagem": "Mensagem erro"
    *       }
**/

module.exports = () => (req, res) => {

    AlterarExp(req.body.clienteId, req.body.avatarId, req.body.exp).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarExp:', error);
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        });
};