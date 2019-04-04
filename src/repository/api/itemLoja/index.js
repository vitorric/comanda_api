const { schemaItemLoja } = require('../../../schema/api/itemLoja'),
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
exports.cadastrarItemLoja = async (obj) => {

    let post = new schemaItemLoja(obj);

    return await post.save().then(() => {          
        return post;
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
exports.listarItemLoja = async (obj) => {
    const nomeProd = (!obj.nome) ? "" : obj.nome;
    const idEstabelecimento = obj.idEstabelecimento;
    
    try {
        return await schemaItemLoja.aggregate([
			{
				$match: {
                    estabelecimento: ObjectIdCast(idEstabelecimento),
                    status: { $lt: 2 } ,
					nome: {'$regex' : nomeProd, '$options' : 'i'}							
				}
			}
        ]);
    } catch (error) {
        throw responseHandler(error);
    }
};