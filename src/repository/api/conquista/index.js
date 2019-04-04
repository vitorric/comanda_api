const { schemaConquista } = require('../../../schema/api/conquista'),
    { schemaEstabelecimento } = require('../../../schema/api/estabelecimento'),
    { responseHandler, ObjectIdCast } = require('../../../utils')

/**
* @description Register new cliente
* @author jaffar cardoso <jaffa.cardoso@gmail.com>
* @async
* @function register
* @param {Object} obj - Object contem email e status;
* @returns {Promise.<Object>} The result
* @throws Will throw an error if the argument is null.
*/
exports.cadastrarConquista = async (obj) => {

    let post = new schemaConquista(obj);

    const estabelecimento = await schemaEstabelecimento.findById(obj.estabelecimento);
    
    return await post.save().then(() => {  
        estabelecimento.conquistas.push(post._id);

        return schemaEstabelecimento.findByIdAndUpdate(estabelecimento._id, estabelecimento).then(() => { return post; });  
    }).catch(err => {
        throw responseHandler(err);
    });    
};
