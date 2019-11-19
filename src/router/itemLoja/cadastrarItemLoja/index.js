const { CadastrarItemLoja } = require('../../../service/api/itemLoja'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/cadastrar/itemLoja Cadastrar Item na Loja
    * @apiSampleRequest http://93.188.164.122:3000/api/cadastrar/itemLoja
    * @apiName itemLoja_cadastrar_item_loja
    * @apiGroup ItemLoja_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para se cadastrar um item na loja virtual do estabelecimento
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} produto ObjectId do produto referência do item
    * @apiParam {String} nome Nome do item
    * @apiParam {String} descricao Descrição do item
    * @apiParam {String} tempoEntrarNoAr Data em que o item estará disponível na loja
    * @apiParam {String} tempoDisponivel Data em que o item sairá da loja
    * @apiParam {Int} quantidadeVendida Quantidade que já foi vendida, se recomenda 0
    * @apiParam {Int} preco Preço do item na moeda virtual
    * @apiParam {Int} quantidadeDisponivel Quantidade que de itens disponíveis
    * @apiParam {Int} status Status do item
    * @apiParam {Boolean} hotSale True para o item deve ser destaque na loja
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Object} retorno Objeto que contém as informações do item cadastrado
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem  Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *         "sucesso": true,
    *         "retorno": {
    *             "preco": 150,
    *             "status": 1,
    *             "statusFirebase": 0,
    *             "quantidadeVendida": 0,
    *             "hotSale": false,
    *             "quantidadeDisponivel": 15,
    *             "_id": "5dcc83c81cbb85243c9f56b5",
    *             "produto": "5dc050d94b245a7cfd18b425",
    *             "tempoEntrarNoAr": "2019-11-13T21:54:00.000Z",
    *             "tempoDisponivel": "2019-11-14T01:00:00.000Z",
    *             "nome": "Batata Frita",
    *             "descricao": "Batatinha frita oleosa",
    *             "estabelecimento": "5da46cda540f2c3cd46cfdb3",
    *             "createdAt": "2019-11-13T22:29:28.639Z",
    *             "updatedAt": "2019-11-13T22:29:28.639Z",
    *             "__v": 0
    *         }
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

    CadastrarItemLoja(req.user.estabelecimentoId, req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarItemLoja:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};