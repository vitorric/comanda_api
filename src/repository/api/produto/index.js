const { schemaProduto } = require('../../../schema/api/produto'),
    { ObjectIdCast } = require('../../../utils');

exports.cadastrarProduto = async produto => {
    try
    {
        let produtoNovo = new schemaProduto(produto);

        return await schemaProduto.create(produtoNovo);
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarProduto:', error);
    }
};

exports.listarProdutos = async (estabelecimentoId, nomeProd) => {

    try
    {
        return await schemaProduto.aggregate([
            {
                $match: {
                    estabelecimento: ObjectIdCast(estabelecimentoId),
                    status: { $lt: 2 } ,
                    nome: {'$regex' : nomeProd, '$options' : 'i'}
                }
            }
        ]).exec();
    }
    catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarProdutos:', error);
    }
};