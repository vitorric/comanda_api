const passport = require('passport'),
    passportJWT = passport.authenticate('usuarioAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {

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
    const loginController = require('../../../controller/user/post/login')();
    router.post('/login', passport.authenticate('usuario', {session: false}), loginController);


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
    const findGetUserController = require('../../../controller/user/get')();
    router.get('/find/user',passportJWT, findGetUserController);

    /**
     * @api {post} /find/user find user post
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
    const findPostUserController = require('../../../controller/user/post')();
    router.post('/find/user', findPostUserController);


    /**
     * @api {put} /remove/user find user post
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
     *       url: 'http://localhost:5000/remove/user',
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
    const removeUserController = require('../../../controller/user/put')();
    router.put('/remove/user', removeUserController);


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
    const registerUserController = require('../../../controller/user/post/register')();
    router.post('/cadastrar/usuario', registerUserController);
    return router;
};