const { CadastrarComanda } = require('../../../service/api/comanda'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/cadastrar/comanda Cadastrar Comanda
    * @apiSampleRequest http://93.188.164.122:3000/api/cadastrar/comanda
    * @apiName comanda_criar
    * @apiGroup Comanda_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Cadastra uma comanda para um cliente
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} clienteId ObjectId do cliente
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Object} retorno Objeto que contém as informações da comanda criada
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
    *               "status": 1,
    *               "aberta": true,
    *               "valorTotal": 0,
    *               "_id": "5dca051dec985f533467743f",
    *               "estabelecimento": "5da46cda540f2c3cd46cfdb3",
    *               "grupo": [
    *                   {
    *                       "lider": true,
    *                       "valorPago": 0,
    *                       "jaPagou": false,
    *                       "avatarAlterado": "2019-11-12T01:03:30.831Z",
    *                       "_id": "5dca051dec985f5334677440",
    *                       "cliente": "5db9ec099452080fe4fde8fb"
    *                   }
    *               ],
    *               "produtos": [],
    *               "createdAt": "2019-11-12T01:04:29.969Z",
    *               "updatedAt": "2019-11-12T01:04:29.969Z",
    *               "__v": 0
    *           }
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

    CadastrarComanda(req.user.estabelecimentoId, req.body.clienteId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarComanda:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};