const { ObterProduto } = require('../../../service/api/produto'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/obter/produto Obter Produto
    * @apiSampleRequest http://93.188.164.122:3000/obter/produto
    * @apiName produto_obter
    * @apiGroup Produto_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para obter informações do produto
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} produtoId ObjectId do Produto
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Object} retorno Objeto que contém as informações do produto
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
    *               "custo": 6,
    *               "estoque": 17,
    *               "quantidadeVendida": 3,
    *               "preco": 20,
    *               "status": 1,
    *               "_id": "5dc050d94b245a7cfd18b425",
    *               "codigo": 1,
    *               "nome": "Porção de Batata Frita",
    *               "descricao": "Porção de Batata Frita",
    *               "icon": "5da46cda540f2c3cd46cfdb3_5dc050d94b245a7cfd18b425.png"
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

    ObterProduto(req.body.produtoId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error)  => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterProduto:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};