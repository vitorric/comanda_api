const { AlterarClienteConfigApp } =  require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/alterar_config_app/cliente Alterar Config App
    * @apiSampleRequest http://93.188.164.122:3000/api/alterar_config_app/cliente
    * @apiName cliente_alterar_config_app
    * @apiGroup Cliente
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para o cliente alterar as configurações do aplicativo
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {Object} configApp Contém informações da configuração do aplicativo
    * @apiParam {float} configApp.somFundo Som de fundo do aplicativo
    * @apiParam {float} configApp.somGeral Som geral do aplicativo
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
    *           "mensagem": "Solicitação inválida, tente novamente!"
    *       }
    * @apiErrorExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": false,
    *           "mensagem": "Dados inválidos!"
    *       }
**/
module.exports = () => (req, res) => {

    AlterarClienteConfigApp(req.user.clienteId, req.body).then((result) => resJsonP(res, 200, result.status, null, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarClienteConfigApp:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false);
        });
};