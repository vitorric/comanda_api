const { ListarComprasParaEntregar } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/listar/estabelecimento/entrega/item Listar Produtos para Entregar
    * @apiSampleRequest http://93.188.164.122:3000/listar/estabelecimento/entrega/item
    * @apiName estabelecimento_listar_produtos_entregar
    * @apiGroup Estabelecimento_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para listar os produtos físicos a serem entregues
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Array} retorno Array de objetos dos produtos a serem entregues
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
    *                   "_id": "5dba3717b42ff73a60956c12",
    *                   "infoEntrega": {
    *                       "jaEntregue": false,
    *                       "dataEntrega": null
    *                   },
    *                   "quantidade": 1,
    *                   "cliente": {
    *                       "_id": "5da477d35f54283e4a826908",
    *                       "nome": "Vitor Ricardo",
    *                       "apelido": "Krodon",
    *                       "cpf": "695.326.164-57",
    *                       "chaveAmigavel": 1000
    *                   },
    *                   "produto": {
    *                       "_id": "5dae49ec5f54283e4a82690c",
    *                       "codigo": 1000,
    *                       "nome": "Cerveja de Batata"
    *                   },
    *                   "modoObtido": "Desafio",
    *                   "chaveUnica": "HC6X8W",
    *                   "precoItem": 0,
    *                   "createdAt": "30/10/2019 22:21"
    *               },
    *               {
    *                   "_id": "5dba369bb42ff73a60956c06",
    *                   "infoEntrega": {
    *                       "jaEntregue": false,
    *                       "dataEntrega": null
    *                   },
    *                   "quantidade": 10,
    *                   "cliente": {
    *                       "_id": "5da477d35f54283e4a826908",
    *                       "nome": "Vitor Ricardo",
    *                       "apelido": "Krodon",
    *                       "cpf": "695.326.164-57",
    *                       "chaveAmigavel": 1000
    *                   },
    *                   "produto": {
    *                       "_id": "5dae49ec5f54283e4a82690c",
    *                       "codigo": 1000,
    *                       "nome": "Cerveja de Batata"
    *                   },
    *                   "modoObtido": "Desafio",
    *                   "chaveUnica": "ZEQHZ3",
    *                   "precoItem": 0,
    *                   "createdAt": "30/10/2019 22:19"
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

    ListarComprasParaEntregar(req.user.estabelecimentoId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error)  => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarComprasParaEntregar:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};