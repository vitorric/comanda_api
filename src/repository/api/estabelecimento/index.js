/* eslint-disable no-undef */
const { schemaEstabelecimento } = require('../../../schema/api/estabelecimento'),
    { ObjectIdCast } = require('../../../utils');

exports.cadastrarEstabelecimento = async estabelecimento => {
    try
    {
        let novoEstabelecimento = new schemaEstabelecimento(estabelecimento);

        return await schemaEstabelecimento.create(novoEstabelecimento);
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarEstabelecimento:', error);
    }
};

exports.listarParaClientes = nome => {

    try {
        return schemaEstabelecimento.aggregate([
            {
                $match:
                {
                    status: true,
                    nome: {'$regex' : nome, '$options' : 'i'}
                }
            },
            {
                $sort :
                {
                    'configEstabelecimentoAtual.estaAberta' : -1,
                    'configEstabelecimentoAtual.clientesNoLocal' : -1
                }
            },
            {
                $project:
                {
                    configEstabelecimentoAtual: 1,
                    emailContato: 1,
                    tipo: 1,
                    nome:1,
                    cnpj:1,
                    horarioAtendimentoInicio:1,
                    horarioAtendimentoFim: 1,
                    endereco: 1,
                    descricao: 1,
                    telefone:1,
                    celular: 1,
                    icon: 1
                }
            }
        ]).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarParaClientes:', error);
        throw error;
    }
};

exports.listarParaClientesCompleto = nome => {

    try {
        return schemaEstabelecimento.aggregate([
            {
                $match:
                {
                    status: true,
                    nome: {'$regex' : nome, '$options' : 'i'}
                }
            },
            { $unwind : { 'path': '$itensLoja' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $lookup:
                    {
                        from: 'itemLoja',
                        localField: 'itensLoja.item',
                        foreignField: '_id',
                        as: 'itensLoja.item'
                    }
            },
            { $unwind : { 'path': '$itensLoja.item' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $match: {
                    $or:[
                        { 'itensLoja.item.status': 1 },
                        { 'itensLoja.item.status': null, }
                    ]

                }
            },
            { $sort : { 'itensLoja.hotSale': 1,'itensLoja.tempoDisponivel' : 1, 'itensLoja.quantidadeDisponivel' : 1 } },
            { $unwind : { 'path': '$desafios' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $lookup:
                    {
                        from: 'desafio',
                        localField: 'desafios',
                        foreignField: '_id',
                        as: 'desafios'
                    }
            },
            { $unwind : { 'path': '$desafios' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $match: {
                    $or:[
                        { 'desafios.status': 1 },
                        { 'desafios.status': null, }
                    ]

                }
            },
            { $sort : { 'desafios.tempoDuracao' : -1 } },
            {
                $group: { '_id': '$_id',
                    'status': { '$first': '$status' },
                    'nome': { '$first': '$nome' },
                    'tipo':{ '$first': '$tipo' },
                    'descricao':{ '$first': '$descricao' },
                    'horarioAtendimentoInicio':{ '$first': '$horarioAtendimentoInicio' },
                    'horarioAtendimentoFim':{ '$first': '$horarioAtendimentoFim' },
                    'celular':{ '$first': '$celular' },
                    'telefone':{ '$first': '$telefone' },
                    'emailContato':{ '$first': '$emailContato' },
                    'endereco': {
                        '$first':{
                            'rua': '$endereco.rua',
                            'numero': '$endereco.numero',
                            'bairro': '$endereco.bairro',
                            'cidade': '$endereco.cidade',
                            'estado': '$endereco.estado'
                        }},
                    'configEstabelecimentoAtual': {
                        '$first':{
                            'estaAberta': '$configEstabelecimentoAtual.estaAberta',
                            'clientesNoLocal': '$configEstabelecimentoAtual.clientesNoLocal'
                        }},
                    'desafios': {
                        '$addToSet':'$desafios'
                    },
                    'itensLoja': {
                        '$addToSet':{
                            '_id':'$itensLoja._id',
                            'quantidadeDisponivel':'$itensLoja.quantidadeDisponivel',
                            'tempoDisponivel':'$itensLoja.tempoDisponivel',
                            'quantidadeVendida': '$itensLoja.quantidadeVendida',
                            'hotSale': '$itensLoja.hotSale',
                            'item': {
                                '_id':'$itensLoja.item._id',
                                'icon':'$itensLoja.item.icon',
                                'preco':'$itensLoja.item.preco',
                                'nome':'$itensLoja.item.nome',
                                'descricao':'$itensLoja.item.descricao',
                            }
                        }
                    }
                }
            },
            { $sort : { 'configEstabelecimentoAtual.estaAberta' : -1, 'configEstabelecimentoAtual.clientesNoLocal' : -1 } }

        ]).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarParaClientes:', error);
        throw error;
    }
};

exports.obterEstabelecimentoEmail = async (email, cnpj) => {
    try {
        return schemaEstabelecimento.findOne({
            $or: [{
                'cnpj': cnpj
            }, {
                'email': email
            }]
        }).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterEstabelecimentoEmail:', error);
    }
};

exports.obterParaClientes = async estabelecimentoId => {

    try {
        let estabelecimento = schemaEstabelecimento.aggregate([
            {
                $match:
                {
                    _id: ObjectIdCast(estabelecimentoId)
                }
            },
            { $unwind : { 'path': '$itensLoja' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $lookup:
                    {
                        from: 'itemLoja',
                        localField: 'itensLoja.item',
                        foreignField: '_id',
                        as: 'itensLoja.item'
                    }
            },
            { $unwind : { 'path': '$itensLoja.item' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $match: {
                    $or:[
                        { 'itensLoja.item.status': 1 },
                        { 'itensLoja.item.status': null, }
                    ]

                }
            },
            { $sort : { 'itensLoja.hotSale': 1,'itensLoja.tempoDisponivel' : 1, 'itensLoja.quantidadeDisponivel' : 1 } },
            { $unwind : { 'path': '$desafios' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $lookup:
                    {
                        from: 'desafio',
                        localField: 'desafios',
                        foreignField: '_id',
                        as: 'desafios'
                    }
            },
            { $unwind : { 'path': '$desafios' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $match: {
                    $or:[
                        { 'desafios.status': 1 },
                        { 'desafios.status': null, }
                    ]

                }
            },
            { $sort : { 'desafios.tempoDuracao' : -1 } },
            {
                $group: { '_id': '$_id',
                    'status': { '$first': '$status' },
                    'nome': { '$first': '$nome' },
                    'tipo':{ '$first': '$tipo' },
                    'descricao':{ '$first': '$descricao' },
                    'horarioAtendimentoInicio':{ '$first': '$horarioAtendimentoInicio' },
                    'horarioAtendimentoFim':{ '$first': '$horarioAtendimentoFim' },
                    'celular':{ '$first': '$celular' },
                    'telefone':{ '$first': '$telefone' },
                    'emailContato':{ '$first': '$emailContato' },
                    'endereco': {
                        '$first':{
                            'rua': '$endereco.rua',
                            'numero': '$endereco.numero',
                            'bairro': '$endereco.bairro',
                            'cidade': '$endereco.cidade',
                            'estado': '$endereco.estado'
                        }},
                    'configEstabelecimentoAtual': {
                        '$first':{
                            'estaAberta': '$configEstabelecimentoAtual.estaAberta',
                            'clientesNoLocal': '$configEstabelecimentoAtual.clientesNoLocal'
                        }},
                    'desafios': {
                        '$addToSet':'$desafios'
                    },
                    'itensLoja': {
                        '$addToSet':{
                            '_id':'$itensLoja._id',
                            'quantidadeDisponivel':'$itensLoja.quantidadeDisponivel',
                            'tempoDisponivel':'$itensLoja.tempoDisponivel',
                            'quantidadeVendida': '$itensLoja.quantidadeVendida',
                            'hotSale': '$itensLoja.hotSale',
                            'item': {
                                '_id':'$itensLoja.item._id',
                                'icon':'$itensLoja.item.icon',
                                'preco':'$itensLoja.item.preco',
                                'nome':'$itensLoja.item.nome',
                                'descricao':'$itensLoja.item.descricao',
                            }
                        }
                    }
                }
            },
            { $sort : { 'configEstabelecimentoAtual.estaAberta' : -1, 'configEstabelecimentoAtual.clientesNoLocal' : -1 } }

        ]).exec().then(items => items[0]);

        if (!estabelecimento)
            return { mensagem: Mensagens.ESTABELECIMENTO_NAO_ENCONTRADO };

        return estabelecimento;

    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterParaClientes:', error);
    }
};

exports.obterEstabelecimento = estabelecimentoId => {
    try {
        return schemaEstabelecimento.findOne(
            {
                _id: estabelecimentoId
            },
            {
                password: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0
            }).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterEstabelecimento:', error);
    }
};

exports.alterarClientesNoLocal = async (estabelecimentoId, clientesNoLocal) => {
    try{
        let estabelecimentoAlterado = await schemaEstabelecimento.findOneAndUpdate(
            {
                _id: ObjectIdCast(estabelecimentoId)
            },
            {
                $set: {
                    'configEstabelecimentoAtual.clientesNoLocal': clientesNoLocal
                }
            }).exec();

        if (!estabelecimentoAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in entrarNoEstabelecimento:', error);
        return false;
    }
};

exports.alterarStatusEstabOnline = async (estabelecimentoId, status) => {
    try{
        let estabelecimentoAlterado = await schemaEstabelecimento.findOneAndUpdate(
            {
                _id: ObjectIdCast(estabelecimentoId)
            },
            {
                $set: {
                    'configEstabelecimentoAtual.estaAberta': status
                }
            }).exec();

        if (!estabelecimentoAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarStatusEstabOnline:', error);
        return false;
    }
};

exports.alterarEstabelecimentoIcon = async (estabelecimentoId, nomeIcon) => {

    try {

        let estabelecimentoAlterado = await schemaEstabelecimento.findOneAndUpdate(
            {
                _id: ObjectIdCast(estabelecimentoId)
            },
            {
                $set: {
                    icon: nomeIcon
                }

            }).exec();

        if (!estabelecimentoAlterado){
            return false;
        }

        return true;
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarEstabelecimentoIcon:', error);
    }
};

exports.alterarEstabelecimento = async (estabelecimentoId, estabelecimento) => {

    try {

        let estabelecimentoAlterado = await schemaEstabelecimento.findOneAndUpdate(
            {
                _id: ObjectIdCast(estabelecimentoId)
            },
            {
                $set: {
                    tipo: estabelecimento.tipo,
                    descricao: estabelecimento.descricao,
                    horarioAtendimentoInicio: estabelecimento.horarioAtendimentoInicio,
                    horarioAtendimentoFim: estabelecimento.horarioAtendimentoFim,
                    telefone: estabelecimento.telefone,
                    celular: estabelecimento.celular,
                    endereco: estabelecimento.endereco,
                    coordenadas: estabelecimento.coordenadas
                }

            }).exec();

        if (!estabelecimentoAlterado){
            return false;
        }

        return true;
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarEstabelecimento:', error);
    }
};

exports.adicionarProdutoAoEstabelecimento = async (estabelecimentoId, produtos) => {

    try{
        let estabelecimentoAlterado = await schemaEstabelecimento.findOneAndUpdate(
            {
                _id: ObjectIdCast(estabelecimentoId)
            },
            {
                $set: {
                    produtos: produtos
                }
            }).exec();

        if (!estabelecimentoAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in adicionarProdutoAoEstabelecimento:', error);
        return false;
    }
};

exports.adicionarItemNaLojaDoEstabelecimento = async (estabelecimentoId, itens) => {

    try{
        let estabelecimentoAlterado = await schemaEstabelecimento.findOneAndUpdate(
            {
                _id: ObjectIdCast(estabelecimentoId)
            },
            {
                $set: {
                    itensLoja: itens
                }
            }).exec();

        if (!estabelecimentoAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in adicionarItemNaLojaDoEstabelecimento:', error);
        return false;
    }
};

exports.adicionarDesafiosAoEsabelecimento = async (estabelecimentoId, desafios) => {

    try{
        let estabelecimentoAlterado = await schemaEstabelecimento.findOneAndUpdate(
            {
                _id: ObjectIdCast(estabelecimentoId)
            },
            {
                $set: {
                    desafios: desafios
                }
            }).exec();

        if (!estabelecimentoAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in adicionarDesafiosAoEsabelecimento:', error);
        return false;
    }
};

/*
Obtem a informacao se eh pra setar o estabelecimento como aberto ou fechado no firebase
Obtem os itens da loja que devem ser excluidos e adicionados no firebase
Obtem os desafios que devem ser excluidos e adicionados no firebase
*/
exports.obterInfoProJobOrganizarFB = async () => {

    try{
        let estabelecimentos = await schemaEstabelecimento.aggregate([
            {
                $unwind : { 'path': '$itensLoja' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $lookup: {
                    from: 'itemLoja',
                    let: { itemLojaId: '$itensLoja._id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and:
                                        [
                                            {
                                                $eq: [ '$_id', '$$itemLojaId']
                                            },
                                            {
                                                $lt: [ '$statusFirebase', 2]
                                            },
                                            {
                                                $eq: [ '$status', 1]
                                            }
                                        ]
                                }
                            }
                        },
                        {
                            $project :
                            {
                                '_id': 1,
                                icon: 1,
                                preco: 1,
                                quantidadeVendida: 1,
                                hotSale: 1,
                                quantidadeDisponivel: 1,
                                nome: 1,
                                descricao: 1,
                                tempoDisponivel: 1,
                                adicionar:
                                {
                                    $cond: [
                                        {
                                            $and:
                                            [
                                                {
                                                    $lte:
                                                    [
                                                        '$tempoEntrarNoAr', new Date()
                                                    ]
                                                },
                                                {
                                                    $eq: [ '$statusFirebase', 0]
                                                }
                                            ]
                                        }, 1, 0 ]
                                },
                                remover:
                                {
                                    $cond: [
                                        {
                                            $and:
                                            [
                                                {
                                                    $lte:
                                                    [
                                                        '$tempoDisponivel', new Date()
                                                    ]
                                                },
                                                {
                                                    $eq: [ '$statusFirebase', 1]
                                                }
                                            ]
                                        }, 1, 0 ]
                                }
                            }
                        }

                    ],
                    as: 'itensLoja'
                }
            },
            {
                $unwind : { 'path': '$itensLoja' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $unwind : { 'path': '$desafios' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $lookup: {
                    from: 'desafio',
                    let: { desafioId: '$desafios' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and:
                                        [
                                            {
                                                $eq: [ '$_id', '$$desafioId']
                                            },
                                            {
                                                $lt: [ '$statusFirebase', 2]
                                            },
                                            {
                                                $eq: [ '$status', 1]
                                            }
                                        ]
                                }
                            }
                        },
                        {
                            $project :
                            {
                                '_id': 1,
                                nome: 1,
                                descricao: 1,
                                icon: 1,
                                tempoDuracao: 1,
                                emGrupo: 1,
                                premio: 1,
                                objetivo: 1,
                                adicionar:
                                {
                                    $cond: [
                                        {
                                            $and:
                                            [
                                                {
                                                    $lte:
                                                    [
                                                        '$tempoEntrarNoAr', new Date()
                                                    ]
                                                },
                                                {
                                                    $eq: [ '$statusFirebase', 0]
                                                }
                                            ]
                                        }, 1, 0 ]
                                },
                                remover:
                                {
                                    $cond: [
                                        {
                                            $and:
                                            [
                                                {
                                                    $lte:
                                                    [
                                                        '$tempoDuracao', new Date()
                                                    ]
                                                },
                                                {
                                                    $eq: [ '$statusFirebase', 1]
                                                }
                                            ]
                                        }, 1, 0 ]
                                }
                            }
                        }

                    ],
                    as: 'desafios'
                }
            },
            {
                $unwind : { 'path': '$desafios' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $project :
                {
                    _id: 1,
                    itensLoja: 1,
                    desafios: 1,
                    horarioAtendimentoInicio: 1,
                    horarioAtendimentoFim: 1
                }
            },
            {
                $group:
                {
                    '_id': '$_id',
                    'itensLoja': {
                        '$addToSet':'$itensLoja'
                    },
                    'desafios': {
                        '$addToSet':'$desafios'
                    }
                }
            }
        ]).exec();

        return {estabelecimentos};
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterInfoProJobOrganizarFB:', error);
        return false;
    }
};



//---------------------------------------------------------------------- REFAZER PRA BAIXO

exports.listarParaFirebase = async (obj) => {
    const nomeEstabelecimento = (!obj.nome) ? '' : obj.nome;

    try {
        db.estabelecimento.aggregate([
            {
                $match:
                {
                    status: true,
                    nome: {'$regex' : nomeEstabelecimento, '$options' : 'i'}
                }
            },
            {
                $lookup:
                    {
                        from: 'itemLoja',
                        let: { itemID: '$itensLoja.item'},
                        pipeline: [
                            {
                                $match: {
                                    $and: [
                                        {
                                            $expr: {
                                                $in: [ '$_id', '$$itemID'],
                                            }
                                        },
                                        {
                                            $or:[
                                                { 'status': 1 },
                                                { 'status': null }
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                $project: {
                                    'icon': 1, 'preco': 1, 'nome': 1, 'descricao': 1, 'quantidadeVendida': 1, 'hotSale': 1, 'quantidadeDisponivel': 1, 'tempoDisponivel': 1
                                }
                            },
                            { $sort : { 'hotSale': 1,'tempoDisponivel' : 1, 'quantidadeDisponivel' : 1 } },
                            {
                                '$group': {
                                    '_id': 'null',
                                    'data': { '$push': { 'k': { '$toString': '$_id' }, 'v': '$$ROOT'} }
                                }

                            },
                            {
                                $replaceRoot: {
                                    'newRoot': {
                                        '$arrayToObject': '$data'
                                    }
                                }
                            }

                        ],
                        as: 'itensLoja'
                    }
            },
            { $unwind : { 'path': '$itensLoja' , 'preserveNullAndEmptyArrays': true} },
            {
                $lookup:
                    {
                        from: 'desafio',
                        let: { desafioID: '$desafios'},
                        pipeline: [
                            {
                                $match: {
                                    $and: [
                                        {
                                            $expr: {
                                                $in: [ '$_id', '$$desafioID'],
                                            }
                                        },
                                        {
                                            $or:[
                                                { 'status': 1 },
                                                { 'status': null }
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                $project: {
                                    'descricao':1, 'icon': 1, 'nome':1, 'objetivo':1, 'premio':1, 'tempoDuracao':1
                                },
                            },
                            { $sort : { 'tempoDuracao' : -1 } },
                            {
                                '$group': {
                                    '_id': 'null',
                                    'data': { '$push': { 'k': { '$toString': '$_id' }, 'v': '$$ROOT'} }
                                }

                            },
                            {
                                $replaceRoot: {
                                    'newRoot': {
                                        '$arrayToObject': '$data'
                                    }
                                }
                            }

                        ],
                        as: 'desafios'
                    }
            },
            { $unwind : { 'path': '$desafios' , 'preserveNullAndEmptyArrays': true} },
            {
                $project: {
                    'status': 1,'nome': 1,'tipo':1,'descricao':1,'horarioAtendimentoInicio':1,'horarioAtendimentoFim':1,'celular':1,'telefone':1,'emailContato':1, 'itensLoja': 1,
                    'endereco': 1, 'configEstabelecimentoAtual': 1, 'desafios': 1
                }
            },
            { $sort : { 'configEstabelecimentoAtual.estaAberta' : -1, 'configEstabelecimentoAtual.clientesNoLocal' : -1 } },
            {
                '$group': {
                    '_id': 'null',
                    'data': { '$push': { 'k': { '$toString': '$_id' }, 'v': '$$ROOT'} }
                }

            },
            {
                $replaceRoot: {
                    'newRoot': {
                        '$arrayToObject': '$data'
                    }
                }
            }
        ]);
    } catch (error) {
        console.log('erro na listagem do estabelecimento ' + error);
        throw error;
    }
};