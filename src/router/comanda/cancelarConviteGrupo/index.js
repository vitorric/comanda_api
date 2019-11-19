const { CancelarConviteGrupo } = require('../../../service/api/comanda'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    /**
    * @api {post} http://93.188.164.122:3000/api/cancelar_convite/membro_grupo/comanda Cancelar Convite Grupo
    * @apiSampleRequest http://93.188.164.122:3000/api/cancelar_convite/membro_grupo/comanda
    * @apiName comanda_cancelar_membro_grupo
    * @apiGroup Comanda
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para o cliente, lider de uma comanda, cancelar um convite para entrar no grupo
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {string} chaveAmigavel Chave amigavel do cliente que será cancelado o convite para o grupo
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
    *    {
    *        "sucesso": false,
    *        "mensagem": "Mensagem de erro"
    *    }
**/
    CancelarConviteGrupo(req.user.clienteId, req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in CancelarConviteGrupo:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};