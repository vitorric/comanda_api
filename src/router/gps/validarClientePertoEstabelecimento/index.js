const { ValidarClientePertoEstabelecimento } = require('../../../service/api/gps'),
    { resJsonP } = require('../../../utils');


/**
    * @api {post} http://93.188.164.122:3000/validar/gps/cliente Validar Distância Estabelecimento
    * @apiSampleRequest http://93.188.164.122:3000/validar/gps/cliente
    * @apiName GPS_distancia_estabelecimento
    * @apiGroup GPS
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para validar a distância do cliente para o estabelecimento
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} estabelecimentoId  ObjectId do estabelecimento
    * @apiParam {Object} coordenadas  Objeto que contém a coordenada do cliente
    * @apiParam {String} coordenadas.lat Latitude do cliente
    * @apiParam {String} coordenadas.long Longitude do cliente
    *
    * @apiSuccess {Boolean} sucesso <code>true</code> se estiver perto
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

    ValidarClientePertoEstabelecimento(req.body.estabelecimentoId, req.body.coordenadas).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ValidarClientePertoEstabelecimento:', error);
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        });
};