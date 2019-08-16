const { CadastrarCliente } = require('../../../service/api/cliente'),
    { resJsonP } = require('../../../utils');


/**
        * @api {post} http://93.188.164.122:3000/api/cadastrar/cliente Cadastrar
        * @apiSampleRequest http://93.188.164.122:3000/api/cadastrar/cliente Cadastrar
        * @apiName cliente_cadastrar
        * @apiGroup Cliente
        *
        * @apiVersion 1.0.0
        *
        * @apiDescription Rota para o cliente se cadastrar no aplicativo - Atenção, a senha precisa estar criptografada em <code>MD5</code>
        *
        * @apiHeaderExample {json} Header-Example:
        *     {
        *       content-type: 'application/json'
        *     }
        *
        * @apiParam {string} email  Email do cliente
        * @apiParam {string} password  Password do cliente
        * @apiParam {string} nome  Nome do cliente
        * @apiParam {string} apelido  Apelido do cliente
        * @apiParam {string} sexo  Sexo do cliente
        * @apiParam {Object} avatar  Objeto de avatar do cliente
        * @apiParam {string} avatar.corpo   Referente ao nome da imagem do corpo
	    * @apiParam {string} avatar.cabeca  Referente ao nome da imagem da cabeca
	    * @apiParam {string} avatar.nariz   Referente ao nome da imagem do nariz
	    * @apiParam {string} avatar.olhos   Referente ao nome da imagem dos olhos
	    * @apiParam {string} avatar.boca    Referente ao nome da imagem da boca
	    * @apiParam {string} avatar.roupa   Referente ao nome da imagem da roupa
	    * @apiParam {string} avatar.cabeloTraseiro  Referente ao nome da imagem do cabelo traseiro
	    * @apiParam {string} avatar.cabeloFrontal   Referente ao nome da imagem do cabelo frontal
	    * @apiParam {string} avatar.barba   Referente ao nome da imagem da barba
	    * @apiParam {string} avatar.sombrancelhas   Referente ao nome da imagem das sombrancelhas
	    * @apiParam {string} avatar.orelha  Referente ao nome da imagem da orelha
	    * @apiParam {string} avatar.corPele Referente ao nome da imagem da cor da pele
	    * @apiParam {string} avatar.corCabelo   Referente ao nome da imagem da cor do cabelo
	    * @apiParam {string} avatar.corBarba    Referente ao nome da imagem da cor da barba
        *
        * @apiSuccess {Boolean} sucesso <code>true</code>
        * @apiSuccess {Object} retorno Objeto que contém as informações do cliente
        *
        * @apiError {Boolean} sucesso <code>false</code>
        * @apiError {string} mensagem Mensagem contendo o problema
        *
        *
        * @apiSuccessExample {json} Success-Response:
        *     HTTP/1.1 200 OK
        *       {
        *           "sucesso": true,
        *            "retorno": {
        *               "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoIjp7Il9pZCI6IjVjZGVmMzk5YmVhNDQxNjFjMDczZGVjYyJ9LCJleHAiOjE1NTg2NTc4NTgsImlhdCI6MTU1ODY1NDI1OH0.cd4ul6QIbRezQSSVS3iarkE-YPwIUhHuTOmDUUTKLvA",
        *               "_id": 5cdef399bea44161c073decc
        *             }
        *       }
        *
        * @apiErrorExample {json} Success-Response:
        *     HTTP/1.1 200 OK
        *       {
        *           "sucesso": false,
        *           "mensagem": "Este email já está em uso!"
        *       }
        * @apiErrorExample {json} Success-Response:
        *     HTTP/1.1 200 OK
        *       {
        *           "sucesso": false,
        *           "mensagem": "Este apelido já está em uso!"
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
    CadastrarCliente(req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarCliente:', error);
            resJsonP(res, 200, false, null, Mensagens.CLIENTE_CADASTRAR_ERRO);
        });
};