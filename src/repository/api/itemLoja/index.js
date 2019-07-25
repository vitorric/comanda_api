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

exports.obterItemLojaCliente = itemId => {
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
            },
            {
                $lookup:
                    {
                        from: 'produto',
                        localField: 'produto',
                        foreignField: '_id',
                        as: 'produto'
                    }
            },
            { $unwind : { 'path': '$produto' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $project:
                {
                    tempoDisponivel: { $dateToString: { format: '%d/%m/%Y %H:%m', date: '$tempoDisponivel' } },
                    icon: 1,
                    preco: 1,
                    status: 1,
                    quantidadeVendida: 1,
                    hotSale: 1,
                    quantidadeDisponivel: 1,
                    nome: 1,
                    descricao: 1,
                    'produto._id': 1,
                    'produto.codigo': 1,
                    'produto.nome': 1
                }
            }
        ]).exec();
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarItemLoja:', error);
    }
};

exports.obterItemLoja = async (estabelecimentoId, itemId) => {
    try
    {
        return await schemaItemLoja.aggregate([
            {
                $match: {
                    estabelecimento: ObjectIdCast(estabelecimentoId),
                    _id: ObjectIdCast(itemId)
                }
            },
            {
                $lookup:
                    {
                        from: 'produto',
                        localField: 'produto',
                        foreignField: '_id',
                        as: 'produto'
                    }
            },
            { $unwind : { 'path': '$produto' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $project:
                {
                    tempoDisponivel: 1,
                    icon: 1,
                    preco: 1,
                    status: 1,
                    quantidadeVendida: 1,
                    hotSale: 1,
                    quantidadeDisponivel: 1,
                    nome: 1,
                    descricao: 1,
                    'produto._id': 1,
                    'produto.codigo': 1,
                    'produto.nome': 1
                }
            }
        ]).exec().then(items => items[0]);
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterItemLoja:', error);
    }
};