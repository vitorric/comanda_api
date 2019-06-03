const { EnviarConviteGrupo } = require('../../../service/api/comanda'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    /**
    * @api {post} http://93.188.164.122:3000/api/convidar/membro_grupo/comanda Convidar Membro Grupo
    * @apiSampleRequest http://93.188.164.122:3000/api/convidar/membro_grupo/comanda
    * @apiName comanda_convidar_membro_grupo
    * @apiGroup Comanda
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para o cliente, lider de uma comanda, convidar outro cliente ao grupo
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {string} chaveAmigavel Chave amigavel do cliente que será chamado para o grupo
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiError {string} mensagem Mensagem de sucesso
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": true
    *           "mensagem": "O Convite foi enviado!"
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
    *           "mensagem": "É necessário ser o lider do grupo para convidar um novo membro!"
    *       }
    * @apiErrorExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": false,
    *           "mensagem": "É necessário estar no estabelecimento!"
    *       }
    * @apiErrorExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": false,
    *           "mensagem": "O membro não foi encontrado!"
    *       }
    * @apiErrorExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": false,
    *           "mensagem": "O cliente já tem uma comanda!"
    *       }
    * @apiErrorExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": false,
    *           "mensagem": "Um convite já foi enviado para ele/ela!"
    *       }
    * @apiErrorExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": false,
    *           "mensagem": "Solicitação inválida, tente novamente!"
    *       }
**/
    EnviarConviteGrupo(req.user.clienteId, req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in EnviarConviteGrupo:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};