const { ObterClienteCPF } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
   * @api {post} http://93.188.164.122:3000/api/validar/cadastrar/cliente/cpf  Validar CPF
   * @apiSampleRequest http://93.188.164.122:3000/api/validar/cadastrar/cliente/cpf
   * @apiName cliente_validar_cpf
   * @apiGroup Cliente
   *
   * @apiVersion 1.0.0
   *
   * @apiDescription Rota para validar se um CPF já foi cadastrado
   *
   * @apiHeaderExample {json} Header-Example:
   *     {
   *       content-type: 'application/json'
   *     }
   *
   * @apiParam {string} cpf CPF do cliente
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

module.exports = () => (req, res) => {
    ObterClienteCPF(req.body.cpf).then((result) => resJsonP(res, 200, result.status, null, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterClienteCPF:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};