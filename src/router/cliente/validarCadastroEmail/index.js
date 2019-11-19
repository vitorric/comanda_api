const { ObterClienteEmail } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {
/**
   * @api {post} http://93.188.164.122:3000/api/validar/cadastrar/cliente/email  Validar Email
   * @apiSampleRequest http://93.188.164.122:3000/api/validar/cadastrar/cliente/email
   * @apiName cliente_validar_email
   * @apiGroup Cliente
   *
   * @apiVersion 1.0.0
   *
   * @apiDescription Rota para validar se um Email já foi cadastrado
   *
   * @apiHeaderExample {json} Header-Example:
   *     {
   *       content-type: 'application/json'
   *     }
   *
   * @apiParam {string} email Email do cliente
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
   * @apiErrorExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *         "sucesso": false,
   *         "mensagem": "Mensagem de erro"
   *     }
**/

    ObterClienteEmail(req.body.email).then((result) => resJsonP(res, 200, result.status, null, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterClienteEmail:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};