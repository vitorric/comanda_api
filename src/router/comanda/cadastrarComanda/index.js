const { CadastrarComanda } = require('../../../service/api/comanda'),
    { resJsonP } = require('../../../utils');

/**
        * @api {post} http://93.188.164.122:3000/api/cadastrar/comanda Cadastrar Comanda
        * @apiSampleRequest http://93.188.164.122:3000/api/cadastrar/comanda Cadastrar Comanda
        * @apiName comandar_cadastrar
        * @apiGroup Comanda
        *
        * @apiVersion 1.0.0
        *
        * @apiDescription Rota para o estabelecimento cadastrar uma nova comanda no aplicativo
        *
        * @apiHeader Authorization Bearer Authentication token.
        * @apiHeaderExample {json} Header-Example:
        *     {
        *       content-type: 'application/json',
        *       Authorization: 'Bearer authentication'
        *     }
        *
        * @apiParam {string} status Status do cliente
        * @apiParam {string} nome Nome do cliente
        * @apiParam {string} cpf CPF do cliente
        * @apiParam {string} dataNascimento Data de Nascimento do cliente
        * @apiParam {string} pontos Pontos do cliente
        *
        * @apiSuccess {Boolean} sucesso <code>true</code>
        * @apiSuccess {Object} retorno objeto que contem o registro da comanda
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
        *           "mensagem": "O cliente não está no estabelecimento!"
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
        *           "mensagem": "Dados inválidos!"
        *       }
        * @apiErrorExample {json} Success-Response:
        *     HTTP/1.1 200 OK
        *       {
        *           "sucesso": false,
        *           "mensagem": "Solicitação inválida, tente novamente!"
        *       }
    **/

module.exports = () => (req, res) => {

    CadastrarComanda(req.user.estabelecimentoId, req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarComanda:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });
};