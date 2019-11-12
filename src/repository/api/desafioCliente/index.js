/* eslint-disable no-undef */
const { schemaDesafioCliente } = require('../../../schema/api/desafioCliente'),
    { ObjectIdCast } = require('../../../utils');

exports.cadastrarDesafioCliente = async desafioCliente => {
    try
    {
        let novoDesafioCliente = new schemaDesafioCliente(desafioCliente);

        return await schemaDesafioCliente.create(novoDesafioCliente);
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarDesafioCliente:', error);
    }
};

exports.obterDesafioCliente = async (clienteId, desafioId) => {
    try {
        return schemaDesafioCliente.findOne({
            cliente: ObjectIdCast(clienteId),
            desafio: ObjectIdCast(desafioId)
        }).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarDesafioCliente:', error);
    }
};

exports.listarDesafioCliente = async clienteId => {
    try {
        return schemaDesafioCliente.aggregate([
            {
                $match: {
                    cliente: ObjectIdCast(clienteId),
                    resgatouPremio: false
                }
            },
            {
                $lookup: {
                    from: 'desafio',
                    let: { desafioId: '$desafio' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ '$_id', '$$desafioId'],
                                }
                            }
                        },
                        {
                            $project :
                            {
                                '_id': 1,
                                'nome':1,
                                'icon': 1,
                                'tempoDuracao': { $dateToString: { format: '%d/%m/%Y %H:%M', date: '$tempoDuracao', timezone: 'America/Sao_Paulo' } },
                            }
                        }
                    ],
                    as: 'desafio'
                }
            },
            { $unwind : { 'path': '$desafio' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $lookup: {
                    from: 'cliente',
                    let: { clienteId: '$premio.ganhador' },
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
                                'nome':1
                            }
                        }

                    ],
                    as: 'premio.ganhador'
                }
            },
            { $unwind : { 'path': '$premio.ganhador' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $lookup: {
                    from: 'produto',
                    let: { produtoId: '$premio.produto' },
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
                                    'nome':1,
                                    'icon': 1
                                }
                        }

                    ],
                    as: 'premio.produto'
                }
            },
            { $unwind : { 'path': '$premio.produto' ,
                'preserveNullAndEmptyArrays': true} }
        ]).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarDesafioCliente:', error);
    }
};

exports.listarDesafioClienteConcluido = async clienteId => {
    try {
        return schemaDesafioCliente.aggregate([
            {
                $match: {
                    cliente: ObjectIdCast(clienteId),
                    concluido: true
                }
            },
            {
                $lookup: {
                    from: 'desafio',
                    let: { desafioId: '$desafio' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ '$_id', '$$desafioId'],
                                }
                            }
                        },
                        {
                            $project :
                            {
                                '_id': 1,
                                'nome':1,
                                'icon': 1,
                                'descricao': 1,
                                'objetivo': 1
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
                    from: 'produto',
                    let: { produtoObjId: '$desafio.objetivo.produto' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ '$_id', '$$produtoObjId'],
                                }
                            }
                        },
                        {
                            $project :
                            {
                                '_id': 1,
                                'nome': 1,
                                'icon': 1
                            }
                        }

                    ],
                    as: 'desafio.objetivo.produto'
                }
            },
            {
                $unwind : { 'path': '$desafio.objetivo.produto' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $lookup: {
                    from: 'produto',
                    let: { produtoPremioId: '$premio.produto' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ '$_id', '$$produtoPremioId'],
                                }
                            }
                        },
                        {
                            $project :
                            {
                                '_id': 1,
                                'nome': 1,
                                'icon': 1
                            }
                        }

                    ],
                    as: 'premio.produto'
                }
            },
            {
                $unwind : { 'path': '$premio.produto' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $lookup: {
                    from: 'estabelecimento',
                    let: { estabelecimentoId: '$estabelecimento' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ '$_id', '$$estabelecimentoId'],
                                }
                            }
                        },
                        {
                            $project :
                            {
                                'nome': 1
                            }
                        }

                    ],
                    as: 'estabelecimento'
                }
            },
            {
                $unwind : { 'path': '$estabelecimento' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $project:
                {
                    desafio: 1,
                    dataConclusao:  { $dateToString: { format: '%d/%m/%Y %H:%M', date: '$dataConclusao', timezone: 'America/Sao_Paulo' } },
                    estabelecimento: 1,
                    premio: 1
                }
            }
        ]).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarDesafioCliente:', error);
    }
};

exports.obterDesafioClienteConcluido = async (clienteId, desafioId) => {
    try {
        return schemaDesafioCliente.aggregate([
            {
                $match: {
                    cliente: ObjectIdCast(clienteId),
                    desafio: ObjectIdCast(desafioId),
                    concluido: true
                }
            },
            {
                $lookup: {
                    from: 'desafio',
                    let: { desafioId: '$desafio' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ '$_id', '$$desafioId'],
                                }
                            }
                        },
                        {
                            $project :
                            {
                                '_id': 1,
                                'nome':1,
                                'icon': 1,
                                'descricao': 1,
                                'objetivo': 1
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
                    from: 'produto',
                    let: { produtoObjId: '$desafio.objetivo.produto' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ '$_id', '$$produtoObjId'],
                                }
                            }
                        },
                        {
                            $project :
                            {
                                '_id': 1,
                                'nome': 1,
                                'icon': 1
                            }
                        }

                    ],
                    as: 'desafio.objetivo.produto'
                }
            },
            {
                $unwind : { 'path': '$desafio.objetivo.produto' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $lookup: {
                    from: 'produto',
                    let: { produtoPremioId: '$premio.produto' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ '$_id', '$$produtoPremioId'],
                                }
                            }
                        },
                        {
                            $project :
                            {
                                '_id': 1,
                                'nome': 1,
                                'icon': 1
                            }
                        }

                    ],
                    as: 'premio.produto'
                }
            },
            {
                $unwind : { 'path': '$premio.produto' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $lookup: {
                    from: 'estabelecimento',
                    let: { estabelecimentoId: '$estabelecimento' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ '$_id', '$$estabelecimentoId'],
                                }
                            }
                        },
                        {
                            $project :
                            {
                                'nome': 1
                            }
                        }

                    ],
                    as: 'estabelecimento'
                }
            },
            {
                $unwind : { 'path': '$estabelecimento' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $project:
                {
                    desafio: 1,
                    dataConclusao:  { $dateToString: { format: '%d/%m/%Y %H:%M', date: '$dataConclusao', timezone: 'America/Sao_Paulo' } },
                    estabelecimento: 1,
                    premio: 1
                }
            }
        ]).exec().then(items => items[0]);
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterDesafioClienteConcluido:', error);
    }
};

exports.obterDesafioClienteGrupoNaoConcluido = async clientesId => {
    try {
        return schemaDesafioCliente.aggregate([
            {
                $match: {
                    cliente: { $in: clientesId },
                    concluido: false
                }
            },
            {
                $lookup: {
                    from: 'desafio',
                    let: { desafioId: '$desafio' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: [ '$_id', '$$desafioId'] },
                                        { $eq: ['$emGrupo', true ]}
                                    ]
                                }
                            }
                        },
                        {
                            $project :
                            {
                                '_id': 1
                            }
                        }
                    ],
                    as: 'desafio'
                }
            },
            { $unwind : { 'path': '$desafio' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $project: {
                    desafio: 1
                }
            }
        ]).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterDesafioClienteGrupoNaoConcluido:', error);
    }
};

exports.alterarDesafioCliente = async (clienteId, desafioCliente) => {

    try{
        let clienteAlterado = await schemaDesafioCliente.findOneAndUpdate(
            {
                cliente: ObjectIdCast(clienteId),
                desafio: ObjectIdCast(desafioCliente.desafio)
            },
            {
                $set: {
                    progresso: desafioCliente.progresso,
                    concluido: desafioCliente.concluido,
                    dataConclusao: desafioCliente.dataConclusao
                }
            }).exec();

        if (!clienteAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarDesafioCliente:', error);
        return false;
    }
};

exports.alterarDesafioClienteCompleto = async (clienteId, desafioCliente) => {
    try{
        let clienteAlterado = await schemaDesafioCliente.findOneAndUpdate(
            {
                cliente: ObjectIdCast(clienteId),
                desafio: ObjectIdCast(desafioCliente.desafio)
            },
            {
                $set: {
                    progresso: desafioCliente.progresso,
                    concluido: desafioCliente.concluido,
                    dataConclusao: desafioCliente.dataConclusao,
                    premio: desafioCliente.premio
                }
            }).exec();

        if (!clienteAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarDesafioClienteCompleto:', error);
        return false;
    }
};

exports.alterarDesafioClienteRegastou = async desafioCliente => {
    try{
        let clienteAlterado = await schemaDesafioCliente.findOneAndUpdate(
            {
                _id: ObjectIdCast(desafioCliente._id)
            },
            {
                $set: {
                    resgatouPremio: desafioCliente.resgatouPremio,
                    dataResgate: desafioCliente.dataResgate
                }
            }).exec();

        if (!clienteAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarDesafioClienteRegastou:', error);
        return false;
    }
};

exports.deletarDesafioClienteGrupoNaoConcluido = async desafiosId => {
    try{
        await schemaDesafioCliente.deleteMany(
            {
                _id: { $in: desafiosId }
            }).exec();

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in deletarDesafioClienteGrupoNaoConcluido:', error);
        return false;
    }
};