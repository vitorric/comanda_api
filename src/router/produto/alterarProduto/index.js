const { AlterarProduto } = require('../../../service/api/produto'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/alterar/produto Alterar Produto
    * @apiSampleRequest http://93.188.164.122:3000/api/alterar/produto
    * @apiName produto_alterar
    * @apiGroup Produto_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para alterar o produto fisico de um estabelecimento
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} _id ObjectId do produto
    * @apiParam {String} nome Nome do produto
    * @apiParam {String} descricao Descrição do produto
    * @apiParam {String} icon Nome do icon do produto
    * @apiParam {Int} custo Custo do produto
    * @apiParam {Int} status Status do item loja
    * @apiParam {Int} estoque Estoque do produto
    * @apiParam {Float} preco Preço do produto
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem  Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *         "sucesso": true
    *     }
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

    AlterarProduto(req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error)  => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarProduto:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};