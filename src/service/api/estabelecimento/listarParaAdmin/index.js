const { listarParaAdmin } = require('../../../../repository/api/estabelecimento');
/**
* @description makes the call of the register function and does the treatment that will return to the route
* @author jaffar cardoso <jaffa.cardoso@gmail.com>
* @async
* @function registerUser
* @param {Object} obj - receives an object with the fields to be saved
* @returns {Promise.<Object>} The registerUser
* @throws Will throw an error if the argument is null.
*/
exports.ListarParaAdmin = async (obj) => {
    return await listarParaAdmin(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        console.log('registerUser errr:', err);
        return { status: false, msg: !err ? 'REGISTRATION_ERROR_EMAIL' : 'REGISTRATION_ERROR_USER' };
    });
};