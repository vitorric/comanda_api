/* eslint-disable no-undef */
const { schemaUser } = require('../../../schema/api/user'),
    { responseHandler } = require('../../../utils'),
    JWT = require('jsonwebtoken'),
    {JWT_SECRET} = require('../../../../config');

signToken = user => {
    return 'jwt ' + JWT.sign({
        issuer: 'Comanda', //O atributo iss é uma abreviação para issuer, que é a definição ou o nome da API que gerou este JWT.
        user,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // current time +1 day ahead
    },JWT_SECRET);
};

exports.register = async (obj) => {

    let post = new schemaUser(obj);


    return post.save().then(() => {
        // Generate the token
        const token = signToken(post);

        // Respond with token
        return {token, user: obj};

    }).catch(err => {
        throw responseHandler(err);
    });

};

exports.list = async () => {
    try {
        return await schemaUser.find().select({ __v: 0 }).exec();
    } catch (error) {
        throw responseHandler(error);
    }
};

exports.login = async (user) => {
    try {
        const token = await signToken(user);
        return { token, user };
    } catch (error) {
        throw responseHandler(error);
    }
};