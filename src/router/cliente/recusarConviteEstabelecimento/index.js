const { RecusarConviteEstabelecimento } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
   * @api {post} http://93.188.164.122:3000/api/recusar_convite_estabelecimento/cliente Recusar Convite Estabelecimento
   * @apiSampleRequest http://93.188.164.122:3000/api/recusar_convite_estabelecimento/cliente
   * @apiName cliente_recusar_convite_estabelecimento
   * @apiGroup Cliente
   *
   * @apiVersion 1.0.0
   *
   * @apiDescription Rota para o cliente recusar o convite de um estabelecimento
   *
   * @apiHeader Authorization Bearer Authentication token.
   * @apiHeaderExample {json} Header-Example:
   *     {
   *       content-type: 'application/json',
   *       Authorization: 'Bearer authentication'
   *     }
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
   *     HTTP/1.1 200 OK
   *       {
   *           "sucesso": false,
   *           "mensagem": "Mensagem de erro"
   *       }
    **/
module.exports = () => (req, res) => {

    RecusarConviteEstabelecimento(req.user.clienteId).then((result) => resJsonP(res, 200, result.status, null, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in RecusarConviteEstabelecimento:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });

};