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

exports.obterProduto = produtoId => {
    try
    {
        return schemaProduto.findOne({
            _id: produtoId
        }, {__v: 0, createdAt: 0, updatedAt: 0, estabelecimento: 0 }).exec();
    }
    catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterProduto:', error);
    }
};

exports.obterProdutoPorCodigo = codigo => {
    try
    {
        return schemaProduto.findOne({
            codigo: codigo
        }, {__v: 0, createdAt: 0, updatedAt: 0, estabelecimento: 0 }).exec();
    }
    catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterProdutoPorCodigo:', error);
    }
};

exports.alterarProduto = async (produtoId, produto) => {
    try {

        let alterarProduto = await schemaProduto.findOneAndUpdate(
            {
                _id: ObjectIdCast(produtoId)
            },
            produto).exec();

        if (!alterarProduto)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarProduto:', error);
        return false;
    }
};

exports.alterarProdutoEstoque = async (produtoId, estoque) =>
{
    try {

        let comandaAlterada = await schemaProduto.findOneAndUpdate(
            {
                _id: ObjectIdCast(produtoId)
            },
            {
                $set: {
                    estoque: estoque
                }
            }).exec();

        if (!comandaAlterada)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarItemComanda:', error);
        return false;
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