const { LoginCliente } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/login/cliente Cliente Login
    * @apiSampleRequest http://93.188.164.122:3000/api/login/cliente
    * @apiName cliente_login
    * @apiGroup Login
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Faz o login do cliente no sistema
    *
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json'
    *     }
    *
    * @apiParam {String} email  Email do cliente
    * @apiParam {String} password  Password do cliente
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
    *            "retorno": {
    *               "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoIjp7Il9pZCI6IjVjZGVmMzk5YmVhNDQxNjFjMDczZGVjYyJ9LCJleHAiOjE1NTg2NTc4NTgsImlhdCI6MTU1ODY1NDI1OH0.cd4ul6QIbRezQSSVS3iarkE-YPwIUhHuTOmDUUTKLvA",
    *               "_id": 5cdef399bea44161c073decc
    *             }
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

    LoginCliente(req.user).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in LoginCliente:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};
