const { CadastrarDesafio } = require('../../../service/api/desafio'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/cadastrar/desafio Cadastrar
    * @apiSampleRequest http://93.188.164.122:3000/api/cadastrar/desafio Cadastrar
    * @apiName desafio_cadastrar
    * @apiGroup Desafio_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para o estabelecimento cadastrar um desafio
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {string} nome Nome do desafio
    * @apiParam {string} descricao Descricao do desafio
    * @apiParam {string} icon Nome da imagem do desafio
    * @apiParam {Boolean} emGrupo Se o desafio é em grupo
    * @apiParam {int} status Status do Desafio
    * @apiParam {string} tempoEntrarNoAr Data que o desafio irá começar
    * @apiParam {string} tempoDuracao Data que o desafio irá terminar
    * @apiParam {Object} premio Objeto do premio
    * @apiParam {string} premio.tipo Tipo do premio
    * @apiParam {int} premio.quantidade Quantidade a ser premiada
    * @apiParam {string} produto ObjectId do produto, caso premio seja produto
    * @apiParam {Object} objetivo Objeto do objetivo
    * @apiParam {string} objetivo.tipo Tipo do objetivo
    * @apiParam {int} objetivo.quantidade Quantidade a ser premiada
    * @apiParam {string} produto ObjectId do produto, caso objetivo seja produto
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Object} retorno Objeto que contém as informações do desafio
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
    *               "emGrupo": true,
    *               "statusFirebase": 0,
    *               "status": 1,
    *               "_id": "5dcb484028d2e47150dacf14",
    *               "nome": "Testando Novo Premio",
    *               "descricao": "Consuma 1 coxinha",
    *               "icon": "defaultIcon.png",
    *               "premio": {
    *                   "tipo": "CPGold",
    *                   "quantidade": 100
    *               },
    *               "tempoEntrarNoAr": "2019-11-12T23:05:00.000Z",
    *               "tempoDuracao": "2019-11-13T00:00:00.000Z",
    *               "objetivo": {
    *                   "tipo": "Dinheiro",
    *                   "quantidade": 10
    *               },
    *               "estabelecimento": "5da46cda540f2c3cd46cfdb3",
    *               "createdAt": "2019-11-13T00:03:12.808Z",
    *               "updatedAt": "2019-11-13T00:03:12.808Z",
    *               "__v": 0
    *           }
    *       }
    *
    *
    * @apiErrorExample {json} Senha inválida:
    *     HTTP/1.1 401 Unauthorized
    *     {
    *       Unauthorized
    *     }
    * @apiErrorExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": false,
    *           "mensagem": "Mensagem erro"
    *       }
**/

module.exports = () => (req, res) => {

    CadastrarDesafio(req.user.estabelecimentoId, req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarDesafio:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });

};