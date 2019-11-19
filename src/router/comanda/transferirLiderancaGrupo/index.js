const { TransferirLiderancaGrupo } = require('../../../service/api/comanda'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/transferir/lideranca/comanda Transferir Liderança Grupo
    * @apiSampleRequest http://93.188.164.122:3000/api/transferir/lideranca/comanda
    * @apiName comanda_transferir_lideranca
    * @apiGroup Comanda
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para o cliente lider de uma comanda, transferir a liderança para outro
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {string} comandaId ObjectId da comanda
    * @apiParam {clienteNovoLiderId}  ObjectId do cliente
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

    TransferirLiderancaGrupo(req.body.comandaId, req.user.clienteId, req.body.clienteNovoLiderId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in TransferirLiderancaGrupo:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};