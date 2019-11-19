const { SolicitarRecuperarSenha } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
   * @api {post} http://93.188.164.122:3000/api/solicitar/recuperar_senha Solicita a Recuperação da Senha
   * @apiSampleRequest http://93.188.164.122:3000/api/solicitar/recuperar_senha
   * @apiName cliente_solicitar_recuperar_senha
   * @apiGroup Cliente
   *
   * @apiVersion 1.0.0
   *
   * @apiDescription Rota para solicitar a recuperação da senha do cliente
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
   *           "mensagem": "Mensagem de sucesso"
   *       }
   *
   * @apiErrorExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *       {
   *           "sucesso": false,
   *           "mensagem": "Mensagem de erro"
   *       }
**/

module.exports = () => (req, res) => {
    SolicitarRecuperarSenha(req.body.email).then((result) => resJsonP(res, 200, result.status, null, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in SolicitarRecuperarSenha:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};