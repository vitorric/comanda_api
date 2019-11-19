const { AlterarDesafioEstab } = require('../../../service/api/desafio'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/alterar/desafio Alterar
    * @apiSampleRequest http://93.188.164.122:3000/api/alterar/desafio Alterar
    * @apiName desafio_alterar
    * @apiGroup Desafio_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para o estabelecimento alterar as informações do desafio
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
    * @apiParam {string} tempoDuracao Termino do desafio
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
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem  Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": true
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

    AlterarDesafioEstab(req.user.estabelecimentoId, req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarDesafioEstab:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });

};