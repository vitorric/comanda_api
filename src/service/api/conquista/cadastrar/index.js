const { cadastrarConquista } = require('../../../../repository/api/conquista');
/**
* @description makes the call of the register function and does the treatment that will return to the route
* @author jaffar cardoso <jaffa.cardoso@gmail.com>
* @async
* @function cadastrarCliente
* @param {Object} obj - receives an object with the fields to be saved
* @returns {Promise.<Object>} The cadastrarCliente
* @throws Will throw an error if the argument is null.
*/
exports.CadastrarConquista = async (obj) => {
    return await cadastrarConquista(obj).then(result => {     
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        return { status: false, msg: err };
    });
};