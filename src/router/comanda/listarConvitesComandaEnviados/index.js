
const { ListarConvitesComandaEnviados } = require('../../../service/api/comanda'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/listar/convites/enviados Listar Convites Enviados Para Grupo Comanda
    * @apiSampleRequest http://93.188.164.122:3000/api/listar/convites/enviados
    * @apiName comanda_listar_convites_grupo
    * @apiGroup Comanda
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para o cliente, lider de uma comanda, listar os convites foi enviado para o grupo da comanda
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {string} comandaId ObjectId da comanda
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Array} retorno Array de objetos dos convites enviados
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": true,
    *           "retorno": [
    *               {
    *                   "_id": "5db9eb13ddbc6a6108df60b0",
    *                   "apelido": "teste zero2",
    *                   "sexo": "Masculino",
    *                   "avatar": {
    *                       "_id": "5db9eb12ddbc6a6108df60af",
    *                       "info": {
    *                           "level": 1,
    *                           "exp": 0,
    *                           "expProximoLevel": 100
    *                       },
    *                       "corpo": "corpo_01",
    *                       "cabeca": "cabeca_03",
    *                       "nariz": "nariz_03",
    *                       "olhos": "olhos_03",
    *                       "boca": "boca_04",
    *                       "roupa": "roupa_04",
    *                       "cabeloTraseiro": "cabeloTraseiro_03",
    *                       "cabeloFrontal": "cabeloFrontal_01",
    *                       "barba": "barba_03",
    *                       "sombrancelhas": "sombrancelhas_04",
    *                       "orelha": "orelha_01",
    *                       "corPele": "branco",
    *                       "corCabelo": "amarelo",
    *                       "corBarba": "marron",
    *                       "createdAt": "2019-10-30T19:57:06.802Z",
    *                       "updatedAt": "2019-10-30T19:57:06.802Z",
    *                       "__v": 0
    *                   },
    *                   "chaveAmigavel": 1006
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
    *    {
    *        "sucesso": false,
    *        "mensagem": "Mensagem de erro"
    *    }
**/

module.exports = () => (req, res) => {

    ListarConvitesComandaEnviados(req.body.comandaId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarConvitesComandaEnviados:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};