const { AlterarCliente } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
        * @api {post} http://93.188.164.122:3000/api/alterar/cliente Alterar
        * @apiSampleRequest http://93.188.164.122:3000/api/alterar/cliente Alterar
        * @apiName cliente_alterar
        * @apiGroup Cliente
        *
        * @apiVersion 1.0.0
        *
        * @apiDescription Rota para o cliente alterar suas informações dentro do aplicativo
        *
        * @apiHeader Authorization Bearer Authentication token.
        * @apiHeaderExample {json} Header-Example:
        *     {
        *       content-type: 'application/json',
        *       Authorization: 'Bearer authentication'
        *     }
        *
        * @apiParam {string} nome Nome do cliente
        * @apiParam {string} cpf CPF do cliente
        * @apiParam {string} dataNascimento Data de Nascimento do cliente
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
        *           "mensagem": "Solicitação inválida, tente novamente!"
        *       }
    **/

module.exports = () => (req, res) => {
    AlterarCliente(req.user.clienteId, req.body).then((result) => resJsonP(res, 200, result.status))
        .catch(() => resJsonP(res, 200, false));
};
