const { schemaComanda } = require('../../../schema/api/comanda'),
    { ObjectIdCast } = require('../../../utils');

exports.cadastrarComanda = async comanda => {
    try
    {
        let novaComanda = new schemaComanda(comanda);

        return await schemaComanda.create(novaComanda);
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarComanda:', error);
    }
};

exports.obterComandaLider = clienteId => {
    try {
        return schemaComanda.findOne(
            {
                grupo:
                {
                    $elemMatch: {
                        cliente: ObjectIdCast(clienteId),
                        lider: true
                    }
                },
                aberta: true
            }
        ).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterComandaLider:', error);
    }
};

exports.obterComanda = comandaId => {
    try {
        return schemaComanda.findOne(
            {
                _id: ObjectIdCast(comandaId)
            }
        ).exec();
    }catch(error){
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterComanda:', error);
    }
};

exports.obterGrupoComanda = async (comandaId) => {

    try {

        return await schemaComanda.aggregate([
            {
                $match:
                {
                    _id: ObjectIdCast(comandaId)
                }
            },
            {
                $unwind : { 'path': '$grupo' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $lookup: {
                    from: 'cliente',
                    let: { clienteId: '$grupo.cliente' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ '$_id', '$$clienteId'],
                                }
                            }
                        },
                        {
                            $project :
                            {
                                '_id': 1,
                                'avatar':1,
                                'apelido': 1,
                                'sexo': 1
                            }
                        }

                    ],
                    as: 'grupo.cliente'
                }
            },
            {
                $unwind : { 'path': '$grupo.cliente' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $project :
                {
                    'grupo': 1
                }
            },
            {
                $group:
                {
                    '_id': '$_id',
                    'grupo': {
                        '$addToSet':'$grupo'
                    },
                }
            }
        ]).exec().then(items => items[0]);
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterGrupoComanda:', error);
        return false;
    }
};

exports.obterProdutosComanda = async (comandaId) => {

    try {

        return await schemaComanda.aggregate([
            {
                $match:
                {
                    _id: ObjectIdCast(comandaId)
                }
            },
            {
                $unwind : { 'path': '$produtos' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $lookup: {
                    from: 'produto',
                    let: { produtoId: '$produtos.produto' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ '$_id', '$$produtoId'],
                                }
                            }
                        },
                        {
                            $project :
                            {
                                '_id': 1,
                                'icon':1,
                                'nome': 1
                            }
                        }

                    ],
                    as: 'produtos.produto'
                }
            },
            {
                $unwind : { 'path': '$produtos.produto' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $project :
                {
                    'produtos': 1
                }
            },
            {
                $group:
                {
                    '_id': '$_id',
                    'produtos': {
                        '$addToSet':'$produtos'
                    },
                }
            }
        ]).exec().then(items => items[0]);
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarItemComanda:', error);
        return false;
    }
};

exports.alterarGrupoComanda = async (comandaId, grupo) => {

    try {

        let comandaAlterada = await schemaComanda.findOneAndUpdate(
            {
                _id: ObjectIdCast(comandaId)
            },
            {
                $set: {
                    grupo: grupo
                }
            }).exec();

        if (!comandaAlterada)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarGrupoComanda:', error);
        return false;
    }
};

exports.cadastrarItemComanda = async (comandaId, produtos, valorTotal) => {

    try {

        let comandaAlterada = await schemaComanda.findOneAndUpdate(
            {
                _id: ObjectIdCast(comandaId)
            },
            {
                $set: {
                    produtos: produtos,
                    valorTotal: valorTotal
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

exports.transferirLiderancaGrupo = async (comandaId, clienteId, ehLider) => {
    try {

        let comandaAlterada = await schemaComanda.findOneAndUpdate(
            {
                _id: ObjectIdCast(comandaId),
                'grupo.cliente':ObjectIdCast(clienteId)
            },
            {
                $set: {
                    'grupo.$.lider': ehLider
                }
            }).exec();

        if (!comandaAlterada)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in transferirLiderancaGrupo:', error);
        return false;
    }
};

exports.alterarAvatarClienteComanda = async (comandaId, clienteId) => {
    try {

        let comandaAlterada = await schemaComanda.findOneAndUpdate(
            {
                _id: ObjectIdCast(comandaId),
                'grupo.cliente':ObjectIdCast(clienteId)
            },
            {
                $set:
                {
                    'grupo.$.avatarAlterado': Date.now()
                }
            }).exec();

        if (!comandaAlterada)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarAvatarClienteComanda:', error);
        return false;
    }
};

exports.listarComandasEstab = async estabelecimentoId => {
    try {
        return await schemaComanda.aggregate([
            {
                $match: {
                    estabelecimento: ObjectIdCast(estabelecimentoId)
                }
            },
            { $unwind : { 'path': '$grupo' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $lookup:
                    {
                        from: 'cliente',
                        localField: 'grupo.cliente',
                        foreignField: '_id',
                        as: 'lider'
                    }
            },
            { $unwind : { 'path': '$lider' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $match: {
                    'grupo.lider': true
                }
            },
            { $sort : { aberta: -1, createdAt: -1 } },
            {
                $project:
                {
                    createdAt: { $dateToString: { format: '%d/%m/%Y %H:%M', date: '$createdAt', timezone: 'America/Sao_Paulo' } },
                    valorTotal: 1,
                    status: 1,
                    aberta: 1,
                    'lider.nome': 1,
                    dataSaida: { $dateToString: { format: '%d/%m/%Y %H:%M', date: '$dataSaida', timezone: 'America/Sao_Paulo' } }
                }
            }
        ]).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarComandasEstab:', error);
    }
};


exports.obterMelhorDesafioClienteGrupoPorComanda = async (comandaId, desafioId) => {
    try {
        return await schemaComanda.aggregate([
            {
                $match: {
                    _id: ObjectIdCast(comandaId)
                }
            },
            {
                $unwind : { 'path': '$grupo' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $lookup: {
                    from: 'desafio',
                    let: { estabelecimentoId: '$estabelecimento'},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: [ '$estabelecimento', '$$estabelecimentoId'] },
                                        { $eq: [ '$emGrupo', true ] },
                                        { $eq: [ '$status', 1 ]},
                                        { $eq: [ '$statusFirebase', 1] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                '_id': 1
                            }
                        }

                    ],
                    as: 'desafio'
                }
            },
            {
                $unwind : { 'path': '$desafio' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $lookup: {
                    from: 'desafioCliente',
                    let: { clienteId: '$grupo.cliente'},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: [ '$cliente', '$$clienteId'] },
                                        { $eq: [ '$desafio', ObjectIdCast(desafioId)] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                'desafio': 1,
                                'progresso': 1,
                                'concluido': 1
                            }
                        }

                    ],
                    as: 'desafioCliente'
                }
            },
            {
                $unwind : { 'path': '$desafioCliente' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $sort: {
                    'desafioCliente.concluido': 1,
                    'desafioCliente.progresso': 1
                }
            },
            {
                $group: {
                    '_id': '$_id',
                    'desafioCliente': {
                        '$addToSet':'$desafioCliente'
                    }
                }
            },
            {
                $project: {
                    'desafioCliente': {
                        $arrayElemAt: ['$desafioCliente', 0]
                    }
                }
            }]).exec().then(items => items[0].desafioCliente);
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterMelhorDesafioClienteGrupoPorComanda:', error);
    }
};

exports.obterComandaEstab = async comandaId => {

    try {

        return await schemaComanda.aggregate([
            {
                $match:
                {
                    _id: ObjectIdCast(comandaId)
                }
            },
            {
                $unwind : { 'path': '$grupo' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $lookup: {
                    from: 'cliente',
                    let: { clienteId: '$grupo.cliente' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ '$_id', '$$clienteId'],
                                }
                            }
                        },
                        {
                            $project :
                            {
                                '_id': 1,
                                'apelido': 1,
                                'nome': 1,
                                'chaveAmigavel': 1
                            }
                        }
                    ],
                    as: 'grupo.cliente'
                }
            },
            {
                $unwind : { 'path': '$grupo.cliente' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $sort:
                {
                    'grupo.lider': 1
                }
            },
            {
                $unwind : { 'path': '$produtos' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $lookup: {
                    from: 'produto',
                    let: { produtoId: '$produtos.produto' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ '$_id', '$$produtoId']
                                }
                            }
                        },
                        {
                            $project :
                            {
                                '_id': 1,
                                'nome': 1
                            }
                        }
                    ],
                    as: 'produtos.produto'
                }
            },
            {
                $unwind : { 'path': '$produtos.produto' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $group:
                {
                    '_id': {
                        _id: '$_id',
                        status: '$status',
                        valorTotal: '$valorTotal',
                        createdAt: '$createdAt',
                        dataSaida: '$dataSaida',
                        aberta: '$aberta'
                    },
                    'grupo': {
                        '$addToSet':'$grupo'
                    },
                    'produtos': {
                        '$addToSet':'$produtos'
                    }
                }
            },
            {
                $project:
                {
                    _id: '$_id._id',
                    status: '$_id.status',
                    aberta: '$_id.aberta',
                    dataSaida: { $dateToString: { format: '%d/%m/%Y %H:%M', date: '$_id.dataSaida', timezone: 'America/Sao_Paulo' } },
                    grupo: 1,
                    produtos: 1,
                    valorTotal: '$_id.valorTotal',
                    createdAt: { $dateToString: { format: '%d/%m/%Y %H:%M', date: '$_id.createdAt', timezone: 'America/Sao_Paulo' } }
                }
            },
        ]).exec().then(items => {
            if (Object.keys(items[0].produtos[0]).length === 0)
                items[0].produtos = [];

            return items[0];
        });
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterComandaEstab:', error);
        return false;
    }
};

exports.alterarClientePagouComanda = async (comandaId, clienteId, valorPago) => {

    try{
        let comandaAlterada = await schemaComanda.findOneAndUpdate(
            {
                _id: ObjectIdCast(comandaId),
                'grupo.cliente':ObjectIdCast(clienteId)
            },
            {
                $set: {
                    'grupo.$.jaPagou': true,
                    'grupo.$.valorPago': valorPago
                }
            }).exec();

        if (!comandaAlterada)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarClientePagouComanda:', error);
        return false;
    }
};

exports.fecharComanda = async (comandaId, dataSaida) => {

    try{
        let fecharComanda = await schemaComanda.findOneAndUpdate(
            {
                _id: ObjectIdCast(comandaId)
            },
            {
                $set: {
                    aberta: false,
                    dataSaida: dataSaida,
                    'grupo.$[elem].jaPagou' : true
                }
            },
            {
                arrayFilters: [ { 'elem.jaPagou': false } ]
            }).exec();

        if (!fecharComanda)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in fecharComanda:', error);
        return false;
    }
};