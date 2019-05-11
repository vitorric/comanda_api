const passport = require('passport'),
    passportJWT = passport.authenticate('clienteAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {


    /**
 * @api {post} http://93.188.164.122:3000/api/cadastrar/cliente Cria login do cliente no aplicativo
 * @apiSampleRequest http://93.188.164.122:3000/api/alterar/cliente/avatar
 * @apiName alterar_avatar_cliente
 * @apiGroup Avatar
 * @apiVersion 1.0.0
 * @apiDescription Alterar o avatar do cliente
 * @apiHeader Authorization Basic Access Authentication token.
 * @apiSuccess {Object} sucesso <code>true</code>
 * @apiSuccess {string} retorno User successfully registered
 * @apiError {Object} sucesso <code>false</code>
 * @apiError {string} retorno  There was an error in registering || E-mail already registered
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": true,
 *            "retorno": " User successfully registered"
 *       }
 * @apiErrorExample {json} Token-Invalido:
 *     HTTP/1.1 404 Not Found
 *     {
 *       Unauthorized
 *     }
 * @apiErrorExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": false,
 *            "retorno": "There was an error in registering "
 *       }
 * @apiErrorExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": false,
 *            "retorno": " E-mail already registered "
 *       }
**/
    const cadastrarClienteController = require('../../../controller/cliente/cadastrar')();
    router.post('/cadastrar/cliente', cadastrarClienteController);


    /**
 * @api {post} /rgister/user find user post
 * @apiName findpost
 * @apiGroup Find
 * @apiVersion 1.0.0
 * @apiDescription find user for id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       content-type: 'application/json',
 *       Authorization : "JWT token"
 *     }
 * @apiHeader Authorization Basic Access Authentication token.
 * @apiHeader Content-Type application/json
 * @apiSuccess {Object} sucesso <code>true</code>
 * @apiSuccess {string} retorno User successfully registered
 * @apiError {Object} sucesso <code>false</code>
 * @apiError {string} retorno  There was an error in registering || E-mail already registered
 * @apiExample {curl} Example utilizando plugin Testing API:
 *   {
 *       method: 'GET',
 *       url: 'http://localhost:5000/api/register/user',
 *       requestHeader: {
 *           'content-type': 'application/json',
 *           Authorization : "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
 *       }
 *   }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": true,
 *            "retorno": " User successfully registered"
 *       }
 * @apiErrorExample {json} Token-Invalido:
 *     HTTP/1.1 404 Not Found
 *     {
 *       Unauthorized
 *     }
 * @apiErrorExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": false,
 *            "retorno": "There was an error in registering "
 *       }
 * @apiErrorExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": false,
 *            "retorno": " E-mail already registered "
 *       }
**/
    const alterarClienteConfigAppController = require('../../../controller/cliente/alterarConfigApp')();
    router.post('/alterarConfigApp/cliente',passportJWT, alterarClienteConfigAppController);


    /**
 * @api {post} /rgister/user find user post
 * @apiName findpost
 * @apiGroup Find
 * @apiVersion 1.0.0
 * @apiDescription find user for id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       content-type: 'application/json',
 *       Authorization : "JWT token"
 *     }
 * @apiHeader Authorization Basic Access Authentication token.
 * @apiHeader Content-Type application/json
 * @apiSuccess {Object} sucesso <code>true</code>
 * @apiSuccess {string} retorno User successfully registered
 * @apiError {Object} sucesso <code>false</code>
 * @apiError {string} retorno  There was an error in registering || E-mail already registered
 * @apiExample {curl} Example utilizando plugin Testing API:
 *   {
 *       method: 'GET',
 *       url: 'http://localhost:5000/api/register/user',
 *       requestHeader: {
 *           'content-type': 'application/json',
 *           Authorization : "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
 *       }
 *   }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": true,
 *            "retorno": " User successfully registered"
 *       }
 * @apiErrorExample {json} Token-Invalido:
 *     HTTP/1.1 404 Not Found
 *     {
 *       Unauthorized
 *     }
 * @apiErrorExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": false,
 *            "retorno": "There was an error in registering "
 *       }
 * @apiErrorExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": false,
 *            "retorno": " E-mail already registered "
 *       }
**/
    const entrarNoEstabelecimentoController = require('../../../controller/cliente/entrarNoEstabelecimento')();
    router.post('/entrarestabelecimento/cliente',passportJWT, entrarNoEstabelecimentoController);


    /**
 * @api {post} /rgister/user find user post
 * @apiName findpost
 * @apiGroup Find
 * @apiVersion 1.0.0
 * @apiDescription find user for id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       content-type: 'application/json',
 *       Authorization : "JWT token"
 *     }
 * @apiHeader Authorization Basic Access Authentication token.
 * @apiHeader Content-Type application/json
 * @apiSuccess {Object} sucesso <code>true</code>
 * @apiSuccess {string} retorno User successfully registered
 * @apiError {Object} sucesso <code>false</code>
 * @apiError {string} retorno  There was an error in registering || E-mail already registered
 * @apiExample {curl} Example utilizando plugin Testing API:
 *   {
 *       method: 'GET',
 *       url: 'http://localhost:5000/api/register/user',
 *       requestHeader: {
 *           'content-type': 'application/json',
 *           Authorization : "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
 *       }
 *   }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": true,
 *            "retorno": " User successfully registered"
 *       }
 * @apiErrorExample {json} Token-Invalido:
 *     HTTP/1.1 404 Not Found
 *     {
 *       Unauthorized
 *     }
 * @apiErrorExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": false,
 *            "retorno": "There was an error in registering "
 *       }
 * @apiErrorExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": false,
 *            "retorno": " E-mail already registered "
 *       }
**/
    const sairDoEstabelecimentoController = require('../../../controller/cliente/sairDoEstabelecimento')();
    router.post('/sairestabelecimento/cliente',passportJWT, sairDoEstabelecimentoController);



    /**
 * @api {post} /rgister/user find user post
 * @apiName findpost
 * @apiGroup Find
 * @apiVersion 1.0.0
 * @apiDescription find user for id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       content-type: 'application/json',
 *       Authorization : "JWT token"
 *     }
 * @apiHeader Authorization Basic Access Authentication token.
 * @apiHeader Content-Type application/json
 * @apiSuccess {Object} sucesso <code>true</code>
 * @apiSuccess {string} retorno User successfully registered
 * @apiError {Object} sucesso <code>false</code>
 * @apiError {string} retorno  There was an error in registering || E-mail already registered
 * @apiExample {curl} Example utilizando plugin Testing API:
 *   {
 *       method: 'GET',
 *       url: 'http://localhost:5000/api/register/user',
 *       requestHeader: {
 *           'content-type': 'application/json',
 *           Authorization : "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
 *       }
 *   }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": true,
 *            "retorno": " User successfully registered"
 *       }
 * @apiErrorExample {json} Token-Invalido:
 *     HTTP/1.1 404 Not Found
 *     {
 *       Unauthorized
 *     }
 * @apiErrorExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": false,
 *            "retorno": "There was an error in registering "
 *       }
 * @apiErrorExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": false,
 *            "retorno": " E-mail already registered "
 *       }
**/
    const recusarConviteEstabelecimentoController = require('../../../controller/cliente/recusarConviteEstabelecimento')();
    router.post('/recusar_convite_estabelecimento/cliente',passportJWT, recusarConviteEstabelecimentoController);



    /**
 * @api {post} /rgister/user find user post
 * @apiName findpost
 * @apiGroup Find
 * @apiVersion 1.0.0
 * @apiDescription find user for id
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       content-type: 'application/json',
 *       Authorization : "JWT token"
 *     }
 * @apiHeader Authorization Basic Access Authentication token.
 * @apiHeader Content-Type application/json
 * @apiSuccess {Object} sucesso <code>true</code>
 * @apiSuccess {string} retorno User successfully registered
 * @apiError {Object} sucesso <code>false</code>
 * @apiError {string} retorno  There was an error in registering || E-mail already registered
 * @apiExample {curl} Example utilizando plugin Testing API:
 *   {
 *       method: 'GET',
 *       url: 'http://localhost:5000/api/register/user',
 *       requestHeader: {
 *           'content-type': 'application/json',
 *           Authorization : "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
 *       }
 *   }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": true,
 *            "retorno": " User successfully registered"
 *       }
 * @apiErrorExample {json} Token-Invalido:
 *     HTTP/1.1 404 Not Found
 *     {
 *       Unauthorized
 *     }
 * @apiErrorExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": false,
 *            "retorno": "There was an error in registering "
 *       }
 * @apiErrorExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *           "sucesso": false,
 *            "retorno": " E-mail already registered "
 *       }
**/
    const alterarCliente = require('../../../controller/cliente/alterar')();
    router.post('/alterar/cliente', passportJWT, alterarCliente);

    /**
     * @api {post} /login faz o login
     * @apiName findget
     * @apiGroup login
     * @apiVersion 1.0.0
     * @apiDescription faz o login de todo o sistema
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       content-type: 'application/json',
     *       Authorization : "JWT token"
     *     }
     * @apiHeader Authorization Basic Access Authentication token.
     * @apiHeader Content-Type application/json
     * @apiSuccess {Object} sucesso <code>true</code>
     * @apiSuccess {string} retorno User successfully registered
     * @apiError {Object} sucesso <code>false</code>
     * @apiError {string} retorno  There was an error in registering || E-mail already registered
     * @apiExample {curl} Example utilizando plugin Testing API:
     *   {
     *       method: 'POST',
     *       url: 'http://localhost:5000/login',
     *       requestHeader: {
     *           'content-type': 'application/json',
     *           Authorization : "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
     *       }
     *   }
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": true,
     *            "retorno": " User successfully registered"
     *       }
     * @apiErrorExample {json} Token-Invalido:
     *     HTTP/1.1 404 Not Found
     *     {
     *       Unauthorized
     *     }
     * @apiErrorExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": false,
     *            "retorno": "There was an error in registering "
     *       }
     * @apiErrorExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": false,
     *            "retorno": " E-mail already registered "
     *       }
    **/
    const loginController = require('../../../controller/cliente/login')();
    router.post('/login/cliente', passport.authenticate('cliente', {session: false}), loginController);


    /**
     * @api {post} /login faz o login
     * @apiName findget
     * @apiGroup login
     * @apiVersion 1.0.0
     * @apiDescription faz o login de todo o sistema
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       content-type: 'application/json',
     *       Authorization : "JWT token"
     *     }
     * @apiHeader Authorization Basic Access Authentication token.
     * @apiHeader Content-Type application/json
     * @apiSuccess {Object} sucesso <code>true</code>
     * @apiSuccess {string} retorno User successfully registered
     * @apiError {Object} sucesso <code>false</code>
     * @apiError {string} retorno  There was an error in registering || E-mail already registered
     * @apiExample {curl} Example utilizando plugin Testing API:
     *   {
     *       method: 'POST',
     *       url: 'http://localhost:5000/login',
     *       requestHeader: {
     *           'content-type': 'application/json',
     *           Authorization : "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
     *       }
     *   }
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": true,
     *            "retorno": " User successfully registered"
     *       }
     * @apiErrorExample {json} Token-Invalido:
     *     HTTP/1.1 404 Not Found
     *     {
     *       Unauthorized
     *     }
     * @apiErrorExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": false,
     *            "retorno": "There was an error in registering "
     *       }
     * @apiErrorExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": false,
     *            "retorno": " E-mail already registered "
     *       }
    **/
    const recuperarSenhaController = require('../../../controller/cliente/recuperarSenha')();
    router.post('/recuperarSenha/cliente', recuperarSenhaController);


    /**
     * @api {get} /find/user/:id find user get
     * @apiName findget
     * @apiGroup Find
     * @apiVersion 1.0.0
     * @apiDescription find user for id
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       content-type: 'application/json',
     *       Authorization : "JWT token"
     *     }
     * @apiHeader Authorization Basic Access Authentication token.
     * @apiHeader Content-Type application/json
     * @apiSuccess {Object} sucesso <code>true</code>
     * @apiSuccess {string} retorno User successfully registered
     * @apiError {Object} sucesso <code>false</code>
     * @apiError {string} retorno  There was an error in registering || E-mail already registered
     * @apiExample {curl} Example utilizando plugin Testing API:
     *   {
     *       method: 'POST',
     *       url: 'http://localhost:5000/find/user/id',
     *       requestHeader: {
     *           'content-type': 'application/json',
     *           Authorization : "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
     *       }
     *   }
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": true,
     *            "retorno": " User successfully registered"
     *       }
     * @apiErrorExample {json} Token-Invalido:
     *     HTTP/1.1 404 Not Found
     *     {
     *       Unauthorized
     *     }
     * @apiErrorExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": false,
     *            "retorno": "There was an error in registering "
     *       }
     * @apiErrorExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": false,
     *            "retorno": " E-mail already registered "
     *       }
    **/
    const findGetUserController = require('../../../controller/cliente/get/listar')();
    router.get('/listar/cliente',passportJWT, findGetUserController);


    /**
     * @api {post} /rgister/user find user post
     * @apiName findpost
     * @apiGroup Find
     * @apiVersion 1.0.0
     * @apiDescription find user for id
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       content-type: 'application/json',
     *       Authorization : "JWT token"
     *     }
     * @apiHeader Authorization Basic Access Authentication token.
     * @apiHeader Content-Type application/json
     * @apiSuccess {Object} sucesso <code>true</code>
     * @apiSuccess {string} retorno User successfully registered
     * @apiError {Object} sucesso <code>false</code>
     * @apiError {string} retorno  There was an error in registering || E-mail already registered
     * @apiExample {curl} Example utilizando plugin Testing API:
     *   {
     *       method: 'GET',
     *       url: 'http://localhost:5000/api/register/user',
     *       requestHeader: {
     *           'content-type': 'application/json',
     *           Authorization : "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
     *       }
     *   }
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": true,
     *            "retorno": " User successfully registered"
     *       }
     * @apiErrorExample {json} Token-Invalido:
     *     HTTP/1.1 404 Not Found
     *     {
     *       Unauthorized
     *     }
     * @apiErrorExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": false,
     *            "retorno": "There was an error in registering "
     *       }
     * @apiErrorExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": false,
     *            "retorno": " E-mail already registered "
     *       }
    **/
    const comprarItemLojaController = require('../../../controller/cliente/comprarItemLoja')();
    router.post('/compraritem/cliente', passportJWT, comprarItemLojaController);

    /**
     * @api {get} /find/user/:id find user get
     * @apiName findget
     * @apiGroup Find
     * @apiVersion 1.0.0
     * @apiDescription find user for id
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       content-type: 'application/json',
     *       Authorization : "JWT token"
     *     }
     * @apiHeader Authorization Basic Access Authentication token.
     * @apiHeader Content-Type application/json
     * @apiSuccess {Object} sucesso <code>true</code>
     * @apiSuccess {string} retorno User successfully registered
     * @apiError {Object} sucesso <code>false</code>
     * @apiError {string} retorno  There was an error in registering || E-mail already registered
     * @apiExample {curl} Example utilizando plugin Testing API:
     *   {
     *       method: 'POST',
     *       url: 'http://localhost:5000/find/user/id',
     *       requestHeader: {
     *           'content-type': 'application/json',
     *           Authorization : "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
     *       }
     *   }
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": true,
     *            "retorno": " User successfully registered"
     *       }
     * @apiErrorExample {json} Token-Invalido:
     *     HTTP/1.1 404 Not Found
     *     {
     *       Unauthorized
     *     }
     * @apiErrorExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": false,
     *            "retorno": "There was an error in registering "
     *       }
     * @apiErrorExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": false,
     *            "retorno": " E-mail already registered "
     *       }
    **/
    const listarHistoricoCompraController = require('../../../controller/cliente/listarHistoricoCompra')();
    router.post('/listar/cliente/historico/compra',passportJWT, listarHistoricoCompraController);


    /**
     * @api {get} /find/user/:id find user get
     * @apiName findget
     * @apiGroup Find
     * @apiVersion 1.0.0
     * @apiDescription find user for id
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       content-type: 'application/json',
     *       Authorization : "JWT token"
     *     }
     * @apiHeader Authorization Basic Access Authentication token.
     * @apiHeader Content-Type application/json
     * @apiSuccess {Object} sucesso <code>true</code>
     * @apiSuccess {string} retorno User successfully registered
     * @apiError {Object} sucesso <code>false</code>
     * @apiError {string} retorno  There was an error in registering || E-mail already registered
     * @apiExample {curl} Example utilizando plugin Testing API:
     *   {
     *       method: 'POST',
     *       url: 'http://localhost:5000/find/user/id',
     *       requestHeader: {
     *           'content-type': 'application/json',
     *           Authorization : "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
     *       }
     *   }
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": true,
     *            "retorno": " User successfully registered"
     *       }
     * @apiErrorExample {json} Token-Invalido:
     *     HTTP/1.1 404 Not Found
     *     {
     *       Unauthorized
     *     }
     * @apiErrorExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": false,
     *            "retorno": "There was an error in registering "
     *       }
     * @apiErrorExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *           "sucesso": false,
     *            "retorno": " E-mail already registered "
     *       }
    **/
    const listarClienteConquistasController = require('../../../controller/cliente/listarClienteConquistas')();
    router.post('/listar/cliente/conquistas',passportJWT, listarClienteConquistasController);

    return router;
};