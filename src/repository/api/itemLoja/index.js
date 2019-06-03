const { schemaItemLoja } = require('../../../schema/api/itemLoja'),
    { ObjectIdCast } = require('../../../utils');

exports.cadastrarItemLoja = async item => {
    try
    {
        let novoItem = new schemaItemLoja(item);

        return await schemaItemLoja.create(novoItem);
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarItemLoja:', error);
    }
};

exports.obterItemLoja = itemId => {
    try
    {
        return schemaItemLoja.findOne({_id: itemId}).exec();
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterItemLoja:', error);
    }
};

exports.alterarItemLoja = async item => {
    try{

        let itemAlterado = await schemaItemLoja.findOneAndUpdate(
            {
                _id: ObjectIdCast(item._id)
            },
            {
                $set: {
                    nome: item.nome,
                    descricao: item.descricao,
                    icon: item.icon,
                    preco: item.preco,
                    status: item.status,
                    hotSale: item.hotSale,
                    quantidadeDisponivel: item.quantidadeDisponivel,
                    tempoDisponivel: item.tempoDisponivel
                }
            }).exec();

        if (!itemAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterItemLoja:', error);
        return false;
    }
};

exports.alterarItemLojaCompra = async (itemId, quantidadeDisponivel, quantidadeVendida) => {
    try{

        let itemAlterado = await schemaItemLoja.findOneAndUpdate(
            {
                _id: ObjectIdCast(itemId)
            },
            {
                $set: {
                    quantidadeVendida: quantidadeVendida,
                    quantidadeDisponivel: quantidadeDisponivel
                }
            }).exec();

        if (!itemAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarItemLojaCompra:', error);
        return false;
    }
};

exports.listarItemLoja = async (estabelecimentoId, nomeItem) => {
    try
    {
        return await schemaItemLoja.aggregate([
            {
                $match: {
                    estabelecimento: ObjectIdCast(estabelecimentoId),
                    status: { $lt: 2 } ,
                    nome: {'$regex' : nomeItem, '$options' : 'i'}
                }
            }
        ]).exec();
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarItemLoja:', error);
    }
};