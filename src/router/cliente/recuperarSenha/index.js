const { RecuperarSenha } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
   * @api {post} http://93.188.164.122:3000/api/recuperar_senha/cliente Recuperar Senha
   * @apiSampleRequest http://93.188.164.122:3000/api/recuperar_senha/cliente
   * @apiName cliente_recuperar_senha
   * @apiGroup Cliente
   *
   * @apiVersion 1.0.0
   *
   * @apiDescription Rota para recuperar a senha do cliente
   *
   * @apiHeaderExample {json} Header-Example:
   *     {
   *       content-type: 'application/json'
   *     }
   *
   * @apiParam {string} email Email do cliente
   *
   * @apiSuccess {Boolean} sucesso <code>true</code>
   * @apiSuccess {string} mensagem <code>true</code>
   *
   * @apiError {Boolean} sucesso <code>false</code>
   * @apiError {string} mensagem Mensagem contendo o problema
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *       {
   *           "sucesso": true,
   *           "mensagem": "Uma nova senha de acesso foi enviada ao email!"
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
   *           "mensagem": "Usuário não encontrado!"
   *       }
   * @apiErrorExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *       {
   *           "sucesso": false,
   *           "mensagem": "Solicitação inválida, tente novamente!"
   *       }
**/
module.exports = () => (req, res) => {

    RecuperarSenha(req.body.email).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in RecuperarSenha:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};