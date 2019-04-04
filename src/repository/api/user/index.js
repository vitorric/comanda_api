const { schemaUser } = require('../../../schema/api/user'),
    { responseHandler, ObjectIdCast } = require('../../../utils'),
    JWT = require("jsonwebtoken"),
    {JWT_SECRET} = require("../../../../config");

signToken = user => {
    return "jwt " + JWT.sign({
        issuer: "Comanda", //O atributo iss é uma abreviação para issuer, que é a definição ou o nome da API que gerou este JWT.
        user,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // current time +1 day ahead
    },JWT_SECRET);
}

/**
* @description Register new user
* @author jaffar cardoso <jaffa.cardoso@gmail.com>
* @async
* @function register
* @param {Object} obj - Object contem email e status;
* @returns {Promise.<Object>} The result
* @throws Will throw an error if the argument is null.
*/
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


/**
* @description list all user
* @author jaffar cardoso <jaffa.cardoso@gmail.com>
* @async
* @function list
* @returns {Promise.<Object>} The result
* @throws Will throw an error if the argument is null.
*/
exports.list = async () => {
    try {
        return await schemaUser.find().select({ __v: 0 }).exec();
    } catch (error) {
        throw responseHandler(error);
    }
};

exports.login = async (user) => {
    try {     
        const token = await signToken(user)
        return { token, user };
    } catch (error) {
        throw responseHandler(error);
    }    
};

/**
* @description list all user
* @author jaffar cardoso <jaffa.cardoso@gmail.com>
* @async
* @function list
* @returns {Promise.<Object>} The result
* @throws Will throw an error if the argument is null.
*/
const findPost = async (id) => {
    try {
        return await schemaUser.aggregate([
            {
                $redact: {
                    $cond: {
                        if: { $eq: ['$_id', ObjectIdCast(id)] },
                        then: '$$PRUNE',
                        else: '$$KEEP'
                    }
                }
            }
        ]).exec();
    } catch (error) {
        throw responseHandler(error);
    }
};

exports.findPost = findPost;
exports.findGet = findPost;

/**
* @description list all user
* @author jaffar cardoso <jaffa.cardoso@gmail.com>
* @async
* @function list
* @returns {Promise.<Object>} The result
* @throws Will throw an error if the argument is null.
*/
exports.remove = async (id) => {
    try {
        return await schemaUser.deleteMany({ '_id': ObjectIdCast(id) }).exec();
    } catch (error) {
        throw responseHandler(error);
    }
};