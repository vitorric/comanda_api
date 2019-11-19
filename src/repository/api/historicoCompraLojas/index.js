const { schemaHistoricoCompraLojas } = require('../../../schema/api/historicoCompraLojas'),
    { ObjectIdCast } = require('../../../utils');

exports.cadastrarHistoricoCompra = async (clienteId, infoCompra) =>
{
    try
    {
        let novoHistoricoCompra = new schemaHistoricoCompraLojas(infoCompra);
        novoHistoricoCompra.cliente = clienteId;

        return await schemaHistoricoCompraLojas.create(novoHistoricoCompra);
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarHistoricoCompra:', error);
        return false;
    }
};

exports.listarHistoricoCompra = async clienteId => {
    try
    {
        return await schemaHistoricoCompraLojas.aggregate([
            {
                $match:
                {
                    cliente: ObjectIdCast(clienteId)
                }
            },
            {
                $lookup:
                    {
                        from: 'estabelecimento',
                        localField: 'estabelecimento',
                        foreignField: '_id',
                        as: 'estabelecimento'
                    }
            },
            { $unwind : { 'path': '$estabelecimento' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $lookup:
                    {
                        from: 'itemLoja',
                        localField: 'itemLoja',
                        foreignField: '_id',
                        as: 'itemLoja'
                    }
            },
            { $unwind : { 'path': '$itemLoja' ,
                'preserveNullAndEmptyArrays': true} },
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
            { $sort : { createdAt: -1 } },
            { $project :
                { _id: 1,
                    'estabelecimento.nome' : 1 ,
                    createdAt: { $dateToString: { format: '%d/%m/%Y %H:%M', date: '$createdAt', timezone: 'America/Sao_Paulo' } },
                    'itemLoja.nome': 1,
                    'itemLoja.icon': 1,
                    'produto.nome': 1,
                    'produto.icon': 1,
                    precoItem: 1,
                    modoObtido: 1,
                    quantidade: 1,
                    'infoEntrega.jaEntregue': 1,
                    'infoEntrega.dataEntrega': { $dateToString: { format: '%d/%m/%Y %H:%M', date: '$infoEntrega.dataEntrega', timezone: 'America/Sao_Paulo' } },
                    'chaveUnica': 1 } }
        ]).exec();

    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarHistoricoCompra:', error);
    }
};

exports.obterHistoricoCompra = (estabelecimentoId, clienteId, chaveUnica) =>
{
    try
    {
        return schemaHistoricoCompraLojas.findOne(
            {
                estabelecimento: estabelecimentoId,
                cliente: clienteId,
                chaveUnica: chaveUnica
            }).exec();
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterHistoricoCompra:', error);
        return false;
    }
};

exports.obterHistoricoCompraDataEntrega = historicoCompraId =>
{
    try
    {
        return schemaHistoricoCompraLojas.aggregate([
            {
                $match:
                {
                    _id: ObjectIdCast(historicoCompraId)
                }
            },
            {
                $project:{
                    'infoEntrega.dataEntrega': { $dateToString: { format: '%d/%m/%Y %H:%M', date: '$infoEntrega.dataEntrega', timezone: 'America/Sao_Paulo' } }
                }
            }]).exec().then(items => items[0]);
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterHistoricoCompraDataEntrega:', error);
        return false;
    }
};


exports.alterarStatusEntregaItem = async (historicoCompraId, data) => {
    try{
        let historicoAlterado = await schemaHistoricoCompraLojas.findOneAndUpdate(
            {
                _id: ObjectIdCast(historicoCompraId)
            },
            {
                $set: {
                    'infoEntrega.jaEntregue': true,
                    'infoEntrega.dataEntrega': data
                }
            }).exec();

        if (!historicoAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarStatusEntregaItem:', error);
        return false;
    }
};

exports.listarComprasParaEntregar = estabelecimentoId =>
{
    try
    {
        return schemaHistoricoCompraLojas.aggregate([
            {
                $match:
                {
                    estabelecimento: ObjectIdCast(estabelecimentoId),
                }
            },
            {
                $lookup:
                    {
                        from: 'itemLoja',
                        let: { itemLojaID: '$itemLoja'},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [ '$_id', '$$itemLojaID']
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    produto: 1
                                }
                            }

                        ],
                        as: 'itemLojaProduto'
                    }
            },
            { $unwind : { 'path': '$itemLojaProduto' , 'preserveNullAndEmptyArrays': true} },
            {
                $lookup:
                    {
                        from: 'produto',
                        let: { produtoID: '$produto', itemLojaProdutoID: '$itemLojaProduto.produto' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            { $eq: ['$_id', '$$produtoID'] },
                                            { $eq: ['$_id', '$$itemLojaProdutoID'] }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    'nome': 1,
                                    'codigo': 1
                                }
                            }

                        ],
                        as: 'produto'
                    }
            },
            { $unwind : { 'path': '$produto' , 'preserveNullAndEmptyArrays': true} },
            {
                $lookup:
                    {
                        from: 'cliente',
                        let: { clienteID: '$cliente'},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [ '$_id', '$$clienteID']
                                    }
                                }
                            },
                            {
                                $project: {
                                    'nome' :1,
                                    'cpf': 1,
                                    'apelido': 1,
                                    'chaveAmigavel': 1
                                },
                            }

                        ],
                        as: 'cliente'
                    }
            },
            { $unwind : { 'path': '$cliente' , 'preserveNullAndEmptyArrays': true} },
            {
                $project: {
                    'infoEntrega.jaEntregue': 1,
                    'infoEntrega.dataEntrega': { $dateToString: { format: '%d/%m/%Y %H:%M', date: '$infoEntrega.dataEntrega', timezone: 'America/Sao_Paulo' } },
                    quantidade: 1,
                    cliente: 1,
                    produto: 1,
                    modoObtido: 1,
                    chaveUnica: 1,
                    precoItem: 1,
                    createdAt: { $dateToString: { format: '%d/%m/%Y %H:%M', date: '$createdAt', timezone: 'America/Sao_Paulo' } }
                }
            },
            {
                $sort : { 'infoEntrega.jaEntregue' : 1, createdAt: -1 }
            }
        ]).exec();
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarComprasParaEntregar:', error);
        return false;
    }
};

exports.quantProdutosLojaVendidos = async estabelecimentoId => {

    try{
        return await schemaHistoricoCompraLojas.aggregate([
            {
                $match:
                {
                    estabelecimento: ObjectIdCast(estabelecimentoId),
                    modoObtido: 'Compra'
                }
            },
            {
                $group:
                {
                    _id: null,
                    count:
                    {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    total: '$count'
                }
            }
        ]).exec().then(items => items[0]);
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in quantProdutosLojaVendidos:', error);
        return false;
    }
};