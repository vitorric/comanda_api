const passport = require('passport'),
    passportJWT = passport.authenticate('clienteAuth', {session:false}),
    router = require('express').Router();

module.exports = () => {
    /**
 * @api {post} http://93.188.164.122:3000/api/alterar/cliente/avatar Alterar Avatar do Cliente
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
    router.post('/alterar/cliente/avatar',passportJWT, require('./alterarAvatar')());

    return router;
};