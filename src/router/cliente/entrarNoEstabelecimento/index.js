const { EntrarNoEstabelecimento } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
        * @api {post} http://93.188.164.122:3000/api/entrar_estabelecimento/cliente Entrar no Estabelecimento
        * @apiSampleRequest http://93.188.164.122:3000/api/entrar_estabelecimento/cliente
        * @apiName cliente_entrar_estabelecimento
        * @apiGroup Cliente
        *
        * @apiVersion 1.0.0
        *
        * @apiDescription Rota para o cliente entrar no estabelecimento por meio de um QRCode ou Convite do Estabelecimento
        *
        * @apiHeader Authorization Bearer Authentication token.
        * @apiHeaderExample {json} Header-Example:
        *     {
        *       content-type: 'application/json',
        *       Authorization: 'Bearer authentication'
        *     }
        *
        * @apiParam {string} estabelecimentoId ObjectId do estabelecimento
        * @apiParam {Object} coordenadas  Objeto das coordenadas atual do cliente
        * @apiParam {string} coordenadas.lat   Referente a latitude de onde o cliente se encontra
	    * @apiParam {string} coordenadas.long  Referente a longitude de onde o cliente se encontra
        *
        * @apiSuccess {Boolean} sucesso <code>true</code>
        *
        * @apiError {Boolean} sucesso <code>false</code>
        * @apiError {string} mensagem Mensagem contendo o problema
        *
        *
        * @apiSuccessExample {json} Success-Response:
        *     HTTP/1.1 200 OK
        *       {
        *           "sucesso": true
        *       }
        *
        * @apiErrorExample {json} Senha inválida:
        *     HTTP/1.1 401 Unauthorized
        *     {
        *       Unauthorized
        *     }
        * @apiErrorExample {json} Success-Response:
        *    HTTP/1.1 200 OK
        *    {
        *        "sucesso": false,
        *        "mensagem": "Mensagem de erro"
        *    }
    **/
module.exports = () => (req, res) => {

    EntrarNoEstabelecimento(req.user.clienteId, req.body.estabelecimentoId, req.body.coordenadas).then((result) => resJsonP(res, 200, result.status, null, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in EntrarNoEstabelecimento:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};