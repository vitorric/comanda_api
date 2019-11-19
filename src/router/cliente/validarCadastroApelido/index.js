const { ObterClienteApelido } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {
/**
   * @api {post} http://93.188.164.122:3000/api/validar/cadastrar/cliente/apelido  Validar Apelido
   * @apiSampleRequest http://93.188.164.122:3000/api/validar/cadastrar/cliente/apelido
   * @apiName cliente_validar_apelido
   * @apiGroup Cliente
   *
   * @apiVersion 1.0.0
   *
   * @apiDescription Rota para validar se um Apelido já foi cadastrado
   *
   * @apiHeaderExample {json} Header-Example:
   *     {
   *       content-type: 'application/json'
   *     }
   *
   * @apiParam {string} apelido Apelido do cliente
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

    ObterClienteApelido(req.body.apelido).then((result) => resJsonP(res, 200, result.status, null, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterClienteApelido:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};