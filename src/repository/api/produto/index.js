const { schemaEstabelecimento } = require('../../../schema/api/estabelecimento'),
    { schemaProduto } = require('../../../schema/api/produto'),
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
exports.cadastrarProduto = async (obj) => {

    let post = new schemaProduto(obj);

    const estabelecimento = await schemaEstabelecimento.findById(post.estabelecimento);
    
    return await post.save().then(() => {
        estabelecimento.produtos.push(post._id);
        return schemaEstabelecimento.findByIdAndUpdate(estabelecimento._id, estabelecimento).then(() => {             
            return post;
        }).catch(err => {
            throw responseHandler(err);
        });    
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
exports.listarProdutos = async (obj) => {
    const nomeProd = (!obj.nome) ? "" : obj.nome;
    const idEstabelecimento = obj.idEstabelecimento;
    
    try {
        return await schemaProduto.aggregate([
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