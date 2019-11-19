const { ObterClienteChaveUnica } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/obter/cliente/chave_unica Obter Cliente Chave Unica
    * @apiSampleRequest http://93.188.164.122:3000/api/obter/cliente/chave_unica
    * @apiName cliente_obter_chave_unica
    * @apiGroup Cliente_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Obtém um cliente pela chave unica gerada no cadastro
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} chaveAmigavel Chave amigavel e unica do cliente
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
    *               "_id": "5da477d35f54283e4a826908",
    *               "nome": "Vitor Ricardo",
    *               "apelido": "Krodon",
    *               "cpf": "695.326.164-57",
    *               "chaveAmigavel": 1000
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

    ObterClienteChaveUnica(req.body.chaveAmigavel).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterClienteChaveUnica:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};