const { EntrarNoEstabelecimento } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
        * @api {post} http://93.188.164.122:3000/api/entrar_estabelecimento/cliente Entrar no Estabelecimento
        * @apiSampleRequest http://93.188.164.122:3000/api/entrar_estabelecimento/cliente
        * @apiName cliente_entrar_restaurante
        * @apiGroup Cliente
        *
        * @apiVersion 1.0.0
        *
        * @apiDescription Rota para o cliente entrar no restaurante por meio de um QRCode ou Convite do Estabelecimento
        *
        * @apiHeader Authorization Bearer Authentication token.
        * @apiHeaderExample {json} Header-Example:
        *     {
        *       content-type: 'application/json',
        *       Authorization: 'Bearer authentication'
        *     }
        *
        * @apiParam {string} estabelecimentoId ObjectId do estabelecimento
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
        *           "sucesso": true,
        *           "retorno": {
        *           "status": 1,
        *           "valorTotal": 0,
        *           "_id": "5cec76f60a397c3020d62022",
        *           "dataEntrada": "1970-01-01T00:00:00.027Z",
        *           "estabelecimento": "5cdcc0885d47c43790919e7c",
        *           "grupo": [
        *                   {
        *                       "lider": true,
        *                       "valorPago": 0,
        *                       "_id": "5cec76f60a397c3020d62023",
        *                       "cliente": "5cdd8c95f8486809ccb86568"
        *                   }
        *               ],
        *               "produtos": [],
        *               "createdAt": "2019-05-27T23:47:02.937Z",
        *               "updatedAt": "2019-05-27T23:47:02.937Z",
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
        *           "mensagem": "Estabelecimento não encontrado!"
        *       }
        * @apiErrorExample {json} Success-Response:
        *     HTTP/1.1 200 OK
        *       {
        *           "sucesso": false,
        *           "mensagem": "Estabelecimento está fechado!"
        *       }
        * @apiErrorExample {json} Success-Response:
        *     HTTP/1.1 200 OK
        *       {
        *           "sucesso": false,
        *           "mensagem": "É necessário sair do estabelecimento atual!"
        *       }
    **/
module.exports = () => (req, res) => {

    EntrarNoEstabelecimento(req.user.clienteId, req.body.estabelecimentoId).then((result) => resJsonP(res, 200, result.status, null, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in EntrarNoEstabelecimento:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};