const { schemaEstabelecimento } = require('../../../schema/api/estabelecimento'),
    { schemaProduto } = require('../../../schema/api/produto'),
    { responseHandler, ObjectIdCast } = require('../../../utils');

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

exports.listarProdutos = async (obj) => {
    const nomeProd = (!obj.nome) ? '' : obj.nome;
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