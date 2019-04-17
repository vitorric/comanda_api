const { schemaConquista } = require('../../../schema/api/conquista'),
    { schemaEstabelecimento } = require('../../../schema/api/estabelecimento'),
    { responseHandler } = require('../../../utils');

exports.cadastrarConquista = async (obj) => {

    let post = new schemaConquista(obj);

    const estabelecimento = await schemaEstabelecimento.findById(obj.estabelecimento);

    return await post.save().then(async () => {
        estabelecimento.conquistas.push(post._id);

        await schemaEstabelecimento.findByIdAndUpdate(estabelecimento._id, estabelecimento);
        return post;
    }).catch(err => {
        throw responseHandler(err);
    });
};
