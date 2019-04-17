const { schemaItemLoja } = require('../../../schema/api/itemLoja'),
    { responseHandler, ObjectIdCast } = require('../../../utils');

exports.cadastrarItemLoja = async (obj) => {

    let post = new schemaItemLoja(obj);

    return await post.save().then(() => {
        return post;
    }).catch(err => {
        throw responseHandler(err);
    });
};

exports.listarItemLoja = async (obj) => {
    const nomeProd = (!obj.nome) ? '' : obj.nome;
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