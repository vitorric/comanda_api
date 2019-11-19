const { AlterarItemLoja } = require('../../../service/api/itemLoja'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/alterar/itemLoja Alterar Item Loja
    * @apiSampleRequest http://93.188.164.122:3000/api/alterar/itemLoja
    * @apiName itemLoja_alterar
    * @apiGroup ItemLoja_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para alterar o item virtual da loja do estabelecimento
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} _id ObjectId do item loja
    * @apiParam {String} nome Nome do item loja
    * @apiParam {String} descricao Descrição do item loja
    * @apiParam {String} icon Nome do icon da item loja
    * @apiParam {Int}   preco Preço de moeda virtual do item loja
    * @apiParam {Int} status Status do item loja
    * @apiParam {Boolean} hotSale Valor true para o item loja estar em destaque na loja
    * @apiParam {Int} quantidadeDisponivel Quantidade disponível em estoque
    * @apiParam {String} tempoDisponivel Data em que o item sairá da loja
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

    AlterarItemLoja(req.user.estabelecimentoId, req.body).then((result) => resJsonP(res, 200, result.status, null, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarItemLoja:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};