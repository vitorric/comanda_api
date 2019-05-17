const { schemaHistoricoCompraLojas } = require('../../../schema/api/historicoCompraLojas'),
    { schemaCliente } = require('../../../schema/api/cliente'),
    { schemaEstabelecimento } = require('../../../schema/api/estabelecimento'),
    { ObjectIdCast } = require('../../../utils');

exports.listarHistoricoCompra = clienteId => {
    try {
        return schemaHistoricoCompraLojas.aggregate([
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
            { $project : { _id: 1, 'estabelecimento.nome' : 1 , createdAt : 1, 'itemLoja.nome': 1, precoItem: 1, 'infoEntrega.jaEntregue': 1, 'infoEntrega.dataEntrega': 1 } },
            { $sort : { createdAt: -1 } }
        ]).exec();

    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarHistoricoCompra:', error);
    }
};

//---------------------------------------------------------------------- REFAZER PRA BAIXO
exports.comprarItemLoja = async (obj) => {
    const cliente = await schemaCliente.findById(ObjectIdCast(obj.cliente));

    const estabelecimento = await schemaEstabelecimento.findById(ObjectIdCast(obj.estabelecimento));
    let estabelecimentoItem;

    estabelecimento.itensLoja.map(function(value)
    {
        if (value._id == obj.itemLoja){
            estabelecimentoItem = value;
        }
    }
    );

    if (estabelecimentoItem.quantidadeDisponivel <= 0)
        return {msg: 'ITEM_LOJA_SEM_ESTOQUE', status: true};
    else if (new Date(estabelecimentoItem.tempoDisponivel) < new Date())
        return {msg: 'ITEM_LOJA_TEMPO_EXPIRADO', status: true};

    estabelecimentoItem.quantidadeDisponivel -= 1;
    estabelecimentoItem.quantidadeVendida += 1;

    const { schemaItemLoja } = require('../../../schema/api/itemLoja');

    await schemaEstabelecimento.findByIdAndUpdate(estabelecimento._id, estabelecimento);
    let idItemLoja;
    let precoItem;
    await schemaItemLoja.findById(ObjectIdCast(estabelecimentoItem.item)).then((item) => {
        cliente.diminuirDinheiroNoEstabelecimento(obj.estabelecimento, item.preco);
        idItemLoja = item._id;
        precoItem = item.preco;
    }).catch(err => {
        throw err;
    });

    return await schemaCliente.findByIdAndUpdate(cliente._id, cliente).then(() => {
        let historicoCompra = new schemaHistoricoCompraLojas(obj);
        historicoCompra.itemLoja = idItemLoja;
        historicoCompra.precoItem = precoItem;

        //return historicoCompra.save();
        historicoCompra.save();

        return {status: true, msg: 'ITEM_COMPRADO'};
    }).catch(err => {
        console.log(err);
        throw err;
    });

};