const { ObterHistoricoDashboard } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/obter/estabelecimento/dashboard Obter Dashboard Estabelecimento
    * @apiSampleRequest http://93.188.164.122:3000/obter/estabelecimento/dashboard
    * @apiName estabelecimento_dashboard
    * @apiGroup Estabelecimento_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para obter as informações do estabelecimento
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Object} retorno Array de objetos que contém as informações do dashboard estabelecimento
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem  Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": true,
    *           "retorno": {
    *               "totalClientes": 5,
    *               "totalDesafiosConcluidos": 5,
    *               "totalProdutosFisicos": 59,
    *               "totalProdutosLoja": 3
    *           }
    *       }
    *
    * @apiErrorExample {json} Senha inválida:
    *     HTTP/1.1 401 Unauthorized
    *     {
    *       Unauthorized
    *     }
    * @apiErrorExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *         "sucesso": false,
    *         "mensagem": "Mensagem de erro"
    *     }
**/

module.exports = () => (req, res) => {

    ObterHistoricoDashboard(req.user.estabelecimentoId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterHistoricoDashboard:', error);
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        });
};