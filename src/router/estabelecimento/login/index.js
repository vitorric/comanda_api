const { LoginEstabelecimento } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/login/estabelecimento Estabelecimento Login
    * @apiSampleRequest http://93.188.164.122:3000/api/login/estabelecimento
    * @apiName estabelecimento_login
    * @apiGroup Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Faz o login do estabelecimento no sistema
    *
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json'
    *     }
    *
    * @apiParam {String} email  Email do estabelecimento
    * @apiParam {String} password  Password do estabelecimento
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Object} retorno Objeto que contém as informações do estabelecimento
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem  Mensagem contendo o problema
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": true,
    *           "retorno": {
    *               "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoIjp7InN0YXR1cyI6dHJ1ZSwiX2lkIjoiNWRhNDZjZGE1NDBmMmMzY2Q0NmNmZGIzIiwiZW1haWwiOiJlc3RhYjFAZW1haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkckxBMXUyeWJHT1c2MWFaWFhMMXJ6dUhYaUJjU3c4YmQvN0g4MS92OE92aU8xWW5ObXhwU0ciLCJub21lIjoiVG9ycmVtb3MifSwiZXhwIjoxNTczNjg3Njk2LCJpYXQiOjE1NzM2ODQwOTZ9.HH1C8WkcDmSAz1xX5T4MAvXCfI_nrsmzLiIUogYwPls",
    *               "estabelecimento": {
    *                   "status": true,
    *                   "email": "estab1@email.com",
    *                   "nome": "Torremos"
    *               }
    *           }
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
    *           "mensagem": "Mensagem de erro"
    *       }
**/

module.exports = () => (req, res) => {

    LoginEstabelecimento(req.user).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in LoginEstabelecimento:', error);
            resJsonP(res, 200, false, null, Mensagens.LOGIN_NAO_ENCONTRADO);
        });
};
