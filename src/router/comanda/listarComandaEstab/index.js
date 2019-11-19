
const { ListarComandasEstab } = require('../../../service/api/comanda'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/listar/comandas Listar Comandas
    * @apiSampleRequest http://93.188.164.122:3000/listar/comandas
    * @apiName comanda_listar
    * @apiGroup Comanda_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para listar as comandas de um estabelecimento
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Array} retorno Array de objetos das comandas cadastradas
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem  Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": true,
    *           "retorno": [
    *               {
    *                   "_id": "5dc0bc9f3d7aba2bc494fa37",
    *                   "status": 1,
    *                   "aberta": false,
    *                   "valorTotal": 17,
    *                   "lider": {
    *                       "nome": "Vitor Ricardo"
    *                   },
    *                   "createdAt": "04/11/2019 21:04",
    *                   "dataSaida": "04/11/2019 21:05"
    *               },
    *               {
    *                   "_id": "5dc02a144b245a7cfd18b41c",
    *                   "status": 1,
    *                   "aberta": false,
    *                   "valorTotal": 37,
    *                   "lider": {
    *                       "nome": "Mariana Gonçalves"
    *                   },
    *                   "createdAt": "04/11/2019 10:39",
    *                   "dataSaida": "05/11/2019 11:01"
    *               }
    *               ...
    *           ]
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

    ListarComandasEstab(req.user.estabelecimentoId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarComandasEstab:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};