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
                status: 1
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
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarItemComanda:', error);
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