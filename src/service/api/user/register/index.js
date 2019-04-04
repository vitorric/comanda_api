const { register } = require('../../../../repository/api/user');
/**
* @description makes the call of the register function and does the treatment that will return to the route
* @author jaffar cardoso <jaffa.cardoso@gmail.com>
* @async
* @function registerUser
* @param {Object} obj - receives an object with the fields to be saved
* @returns {Promise.<Object>} The registerUser
* @throws Will throw an error if the argument is null.
*/
exports.registerUser = async (obj) => {
    return await register(obj).then(result => {        
        let resulObj = !result ? { msg: 'REGISTRATION_ERROR_EMAIL' } : result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        return { status: false, msg: err === 0 ? 'REGISTRATION_ERROR_EMAIL' : 'REGISTRATION_ERROR_USER' };
    });
};