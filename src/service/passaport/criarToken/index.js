const JWT = require('jsonwebtoken'),
    {JWT_SECRET} = require('../../../../config');

exports.criarToken = (usuario) => {
    try 
    {
        return JWT.sign({
            auth: usuario,
            exp: Math.floor(Date.now() / 1000) + (60 * 60)
        },
        JWT_SECRET);
    } 
    catch (error) 
    {
        console.log(error)
        throw error;
    }
};