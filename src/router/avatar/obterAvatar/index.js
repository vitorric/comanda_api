const { ObterAvatar } = require('../../../service/api/avatar'),
    { resJsonP } = require('../../../utils');
/**
    * @api {post} http://93.188.164.122:3000/api/obter/avatar Obter Avatar
    * @apiSampleRequest http://93.188.164.122:3000/api/obter/avatar
    * @apiName avatar_obter
    * @apiGroup Avatar
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para se obter o avatar de um cliente
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
	* @apiParam {string} avatarId ObjectId do avatar
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Object} retorna Objeto que contém as informações do avatar
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": true,
    *           "retorno": {
    *               "info": {
    *                   "level": 5,
    *                   "exp": 267.5,
    *                   "expProximoLevel": 506.25
    *               },
    *               "_id": "5da477d35f54283e4a826907",
    *               "corpo": "corpo_01",
    *               "cabeca": "cabeca_02",
    *               "nariz": "nariz_01",
    *               "olhos": "olhos_05",
    *               "boca": "boca_03",
    *               "roupa": "roupa_01",
    *               "cabeloTraseiro": "cabeloTraseiro_01",
    *               "cabeloFrontal": "cabeloFrontal_03",
    *               "barba": "barba_01",
    *               "sombrancelhas": "sombrancelhas_02",
    *               "orelha": "orelha_01",
    *               "corPele": "branco",
    *               "corCabelo": "preto",
    *               "corBarba": "preto",
    *               "createdAt": "2019-10-14T13:27:47.865Z",
    *               "updatedAt": "2019-11-06T00:34:21.032Z",
    *               "__v": 0
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
    *       {
    *           "sucesso": false,
    *           "mensagem": "Mensagem erro"
    *       }
**/

module.exports = () => (req, res) => {

    ObterAvatar(req.body.avatarId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterAvatar:', error);
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        });
};