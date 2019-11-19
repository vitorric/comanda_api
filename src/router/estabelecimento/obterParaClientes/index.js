const { ObterParaClientes } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/obter/estabelecimento/cliente Obter Estabelecimento Cliente
    * @apiSampleRequest http://93.188.164.122:3000/obter/estabelecimento/cliente
    * @apiName estabelecimento_cliente_obter
    * @apiGroup Estabelecimento_Cliente
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
    * @apiParam {String} estabelecimentoId  ObjectId do estabelecimento
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Object} retorno Objeto que contém as informações do estabelecimento
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
    *               "_id": "5da46cda540f2c3cd46cfdb3",
    *               "status": true,
    *               "nome": "Torremos",
    *               "tipo": "Restaurante",
    *               "descricao": "Churrascaria de primeira qualidade",
    *               "horarioAtendimentoInicio": "10:00",
    *               "horarioAtendimentoFim": "16:00",
    *               "celular": "(15) 99876-5648",
    *               "telefone": "(15) 3265-9865",
    *               "emailContato": "contato@estab2.com",
    *               "endereco": {
    *                   "rua": "Rua boa pergunta",
    *                   "numero": 326,
    *                   "bairro": "Vila Santana",
    *                   "cidade": "Sorocaba",
    *                   "estado": "SP"
    *               },
    *               "configEstabelecimentoAtual": {
    *                   "estaAberta": true,
    *                   "clientesNoLocal": [
    *                       "5da477d35f54283e4a826908",
    *                       "5daf8ac752b9f543d0d7a0ea",
    *                       "5db9ec099452080fe4fde8fb",
    *                       "5db9ec099452080fe4fde8fb",
    *                       "5db9eb13ddbc6a6108df60b0"
    *                       ...
    *                   ]
    *               },
    *               "desafios": [
    *                   {
    *                       "_id": "5dafa0fb0a6dc34f64b9882a",
    *                       "emGrupo": false,
    *                       "statusFirebase": 2,
    *                       "status": 1,
    *                       "nome": "Desafio Solo 03",
    *                       "descricao": "Consuma R$ 50,00 e ganhe 1x Cerveja Batata",
    *                       "tempoDuracao": "2019-10-27T00:37:00.000Z",
    *                       "tempoEntrarNoAr": "2019-10-23T00:37:48.865Z",
    *                       "premio": {
    *                           "tipo": "Produto",
    *                           "quantidade": 1,
    *                           "produto": "5dae49ec5f54283e4a82690c"
    *                       },
    *                       "objetivo": {
    *                           "tipo": "Dinheiro",
    *                           "quantidade": 50
    *                       },
    *                       "estabelecimento": "5da46cda540f2c3cd46cfdb3",
    *                       "createdAt": "2019-10-23T00:38:19.076Z",
    *                       "updatedAt": "2019-10-27T00:37:00.010Z",
    *                       "__v": 0
    *                   },
    *                   {
    *                       "_id": "5dafa0d80a6dc34f64b98829",
    *                       "emGrupo": false,
    *                       "statusFirebase": 2,
    *                       "status": 1,
    *                       "nome": "Desafio Solo 02",
    *                       "descricao": "Consuma 5x Cerveja Batata e ganhe 150 CPGold",
    *                       "tempoDuracao": "2019-10-27T00:37:00.000Z",
    *                       "tempoEntrarNoAr": "2019-10-23T00:37:01.758Z",
    *                       "premio": {
    *                           "tipo": "CPGold",
    *                           "quantidade": 150
    *                       },
    *                       "objetivo": {
    *                           "tipo": "Produto",
    *                           "quantidade": 5,
    *                           "produto": "5dae49ec5f54283e4a82690c"
    *                       },
    *                       "estabelecimento": "5da46cda540f2c3cd46cfdb3",
    *                       "createdAt": "2019-10-23T00:37:44.286Z",
    *                       "updatedAt": "2019-10-27T00:37:00.010Z",
    *                       "__v": 0
    *                   }
    *                   ...
    *               ],
    *               "itensLoja": [
    *                   {
    *                       "_id": "5dcc83c81cbb85243c9f56b5",
    *                       "item": {}
    *                   },
    *                   {
    *                       "_id": "5dc21183fed7b1592cf2b258",
    *                       "item": {}
    *                   }
    *                   ...
    *               ]
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

    ObterParaClientes(req.body.estabelecimentoId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterParaClientes:', error);
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        });
};