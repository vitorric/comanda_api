const { ClientePagarComanda } = require('../../../service/api/comanda'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/cliente/pagar/comanda Cliente Pagar Comanda
    * @apiSampleRequest http://93.188.164.122:3000/api/cliente/pagar/comanda
    * @apiName comanda_cliente_pagar
    * @apiGroup Comanda_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota em que um estabelecimento informa que o cliente pagou a comanda
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} comandaId ObjectId da comanda
    * @apiParam {String} clienteId ObjectId do cliente
    * @apiParam {double} valorPago Valor que o cliente pagou
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
    ClientePagarComanda(req.user.estabelecimentoId, req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ClientePagarComanda:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};