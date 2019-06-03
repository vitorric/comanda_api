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
            { $project : { _id: 1, 'estabelecimento.nome' : 1 , createdAt : 1, 'itemLoja.nome': 1, precoItem: 1, 'infoEntrega.jaEntregue': 1, 'infoEntrega.dataEntrega': 1, 'chaveUnica': 1 } },
            { $sort : { createdAt: -1 } }
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

exports.alterarStatusEntregaItem = async (historicoCompraId, status, data) => {
    try{
        let historicoAlterado = await schemaHistoricoCompraLojas.findOneAndUpdate(
            {
                _id: ObjectIdCast(historicoCompraId)
            },
            {
                $set: {
                    'infoEntrega.jaEntregue': status,
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