
const { ObterComandasEstab } = require('../../../service/api/comanda'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/obter/comanda Obter Comanda
    * @apiSampleRequest http://93.188.164.122:3000/api/obter/comanda
    * @apiName comanda_estabelecimento_obter
    * @apiGroup Comanda_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota que se obtém as informações de uma comanda
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} comandaId ObjectId da comanda
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Object} retorno Objeto que contém as informações da comanda
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
    *               "grupo": [
    *                   {
    *                       "lider": true,
    *                       "valorPago": 0,
    *                       "jaPagou": false,
    *                       "avatarAlterado": "2019-11-12T01:03:30.831Z",
    *                       "_id": "5dca051dec985f5334677440",
    *                       "cliente": {
    *                           "_id": "5db9ec099452080fe4fde8fb",
    *                           "nome": "Teste Zerotres",
    *                           "apelido": "teste03",
    *                           "chaveAmigavel": 1007
    *                       }
    *                   }
    *                   ...
    *               ],
    *               "produtos": [
    *                   {
    *                       "quantidade": 1,
    *                       "_id": "5dca065dff5f2a4ce09a7692",
    *                       "preco": 20,
    *                       "precoTotal": 20,
    *                       "produto": {
    *                           "_id": "5dc050d94b245a7cfd18b425",
    *                           "nome": "Porção de Batata Frita"
    *                       }
    *                   }
    *                   ...
    *               ],
    *               "_id": "5dca051dec985f533467743f",
    *               "status": 1,
    *               "aberta": true,
    *               "dataSaida": null,
    *               "valorTotal": 20,
    *               "createdAt": "11/11/2019 22:04"
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

    ObterComandasEstab(req.body.comandaId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterComandasEstab:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};