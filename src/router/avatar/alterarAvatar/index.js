const { AlterarAvatar } = require('../../../service/api/avatar'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/alterar/cliente/avatar Alterar
    * @apiSampleRequest http://93.188.164.122:3000/api/alterar/cliente/avatar
    * @apiName avatar_alterar
    * @apiGroup Avatar
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para o cliente alterar as configurações de seu avatar
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {string} corpo   Referente ao nome da imagem do corpo
	* @apiParam {string} cabeca  Referente ao nome da imagem da cabeca
	* @apiParam {string} nariz   Referente ao nome da imagem do nariz
	* @apiParam {string} olhos   Referente ao nome da imagem dos olhos
	* @apiParam {string} boca    Referente ao nome da imagem da boca
	* @apiParam {string} roupa   Referente ao nome da imagem da roupa
	* @apiParam {string} cabeloTraseiro  Referente ao nome da imagem do cabelo traseiro
	* @apiParam {string} cabeloFrontal   Referente ao nome da imagem do cabelo frontal
	* @apiParam {string} barba   Referente ao nome da imagem da barba
	* @apiParam {string} sombrancelhas   Referente ao nome da imagem das sombrancelhas
	* @apiParam {string} orelha  Referente ao nome da imagem da orelha
	* @apiParam {string} corPele Referente ao nome da imagem da cor da pele
	* @apiParam {string} corCabelo   Referente ao nome da imagem da cor do cabelo
	* @apiParam {string} corBarba    Referente ao nome da imagem da cor da barba
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
    *           "mensagem": "Mensagem erro"
    *       }
**/

module.exports = () => (req, res) => {
    AlterarAvatar(req.user.clienteId, req.user.avatarId, req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarClienteConfigApp:', error);
            resJsonP(res, 200, false, null, Mensagens.AVATAR_ALTERAR_ERRO);
        });
};