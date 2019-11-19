const { ListarDesafiosEstab } = require('../../../service/api/desafio'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/listar/desafios Listar
    * @apiSampleRequest http://93.188.164.122:3000/listar/desafios
    * @apiName desafio_listar
    * @apiGroup Desafio_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para listar os desafios de um estabelecimento
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Array} retorno Array de objetos das desafios cadastrados
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
    *                   "_id": "5dae4c5f5f54283e4a82690d",
    *                   "emGrupo": true,
    *                   "status": 1,
    *                   "nome": "Consumir Cerveja de Batata em Grupo",
    *                   "premio": {
    *                       "tipo": "Produto",
    *                       "quantidade": 10,
    *                       "produto": {
    *                           "nome": "Cerveja de Batata"
    *                       }
    *                   },
    *                   "objetivo": {
    *                       "tipo": "Produto",
    *                       "quantidade": 1,
    *                       "produto": {
    *                           "nome": "Cerveja de Batata"
    *                       }
    *                   },
    *                   "tempoDuracao": "08/11/2019 20:20"
    *               },
    *               {
    *                   "_id": "5dae4d815f54283e4a82690e",
    *                   "emGrupo": true,
    *                   "status": 1,
    *                   "nome": "Desafio Consumir de Batata Iniciante",
    *                   "premio": {
    *                       "tipo": "CPGold",
    *                       "quantidade": 150
    *                   },
    *                   "objetivo": {
    *                       "tipo": "Produto",
    *                       "quantidade": 5,
    *                       "produto": {
    *                           "nome": "Cerveja de Batata"
    *                       }
    *                   },
    *                   "tempoDuracao": "08/11/2019 15:20"
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

    ListarDesafiosEstab(req.user.estabelecimentoId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarDesafiosEstab:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });

};