/* eslint-disable no-undef */
const { schemaEstabelecimento } = require('../../../schema/api/estabelecimento'),
    { schemaCliente } = require('../../../schema/api/cliente'),
    { schemaRole } = require('../../../schema/api/role'),
    { responseHandler, ObjectIdCast } = require('../../../utils'),
    JWT = require('jsonwebtoken'),
    {JWT_SECRET} = require('../../../../config');

signTokenEstabelecimento = estabelecimento => {
    return 'jwt ' + JWT.sign({
        issuer: 'Comanda', //O atributo iss é uma abreviação para issuer, que é a definição ou o nome da API que gerou este JWT.
        estabelecimento,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // current time +1 day ahead
    },JWT_SECRET);
};

exports.cadastrarEstabelecimento = async (obj) => {
    let post = new schemaEstabelecimento(obj);

    const roleAdmin = new schemaRole();
    roleAdmin.nome = 'Administrador';

    return await roleAdmin.save().then(() => {

        post.roles = [];
        post.roles.push(roleAdmin);

        return post.save().then(() => {
            // Generate the token
            // const token = signTokenEstabelecimento(post);
            // Respond with token
            return {estabelecimento: post, msgAdmin: 'Estabelecimento incluído com sucesso!'};

        }).catch(err => {
            console.log(err);
            throw responseHandler(err);
        });
    }).catch(err => {
        console.log(err);
        throw responseHandler(err);
    });
};

exports.loginEstabelecimento = async (estabelecimento) => {
    try {
        estabelecimento.roles = [];
        estabelecimento.roles[0] = 'Estabelecimento';
        const token = await signTokenEstabelecimento(estabelecimento);
        return { token };
    } catch (error) {
        throw responseHandler(error);
    }
};

exports.obterEstabelecimentoViaToken = async (tokenEncriptado) => {
    try {
        const token = JWT.decode(tokenEncriptado.replace('jwt ',''));

        return { estabelecimento: token.estabelecimento };
    } catch (error) {
        throw responseHandler(error);
    }
};


exports.listarParaClientes = async (obj) => {
    const nomeEstabelecimento = (!obj.nome) ? '' : obj.nome;

    try {
        return await schemaEstabelecimento.aggregate([
            {
                $match:
                {
                    status: true,
                    nome: {'$regex' : nomeEstabelecimento, '$options' : 'i'}
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
            { $unwind : { 'path': '$conquistas' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $lookup:
                    {
                        from: 'conquista',
                        localField: 'conquistas',
                        foreignField: '_id',
                        as: 'conquistas'
                    }
            },
            { $unwind : { 'path': '$conquistas' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $match: {
                    $or:[
                        { 'conquistas.status': 1 },
                        { 'conquistas.status': null, }
                    ]

                }
            },
            { $sort : { 'conquistas.tempoDuracao' : -1 } },
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
                    'conquistas': {
                        '$addToSet':'$conquistas'
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

        ]);
    } catch (error) {
        console.log('erro na listagem do estabelcimento ' + error);
        throw responseHandler(error);
    }
};

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
                        from: 'conquista',
                        let: { conquistaID: '$conquistas'},
                        pipeline: [
                            {
                                $match: {
                                    $and: [
                                        {
                                            $expr: {
                                                $in: [ '$_id', '$$conquistaID'],
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
                        as: 'conquistas'
                    }
            },
            { $unwind : { 'path': '$conquistas' , 'preserveNullAndEmptyArrays': true} },
            {
                $project: {
                    'status': 1,'nome': 1,'tipo':1,'descricao':1,'horarioAtendimentoInicio':1,'horarioAtendimentoFim':1,'celular':1,'telefone':1,'emailContato':1, 'itensLoja': 1,
                    'endereco': 1, 'configEstabelecimentoAtual': 1, 'conquistas': 1
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
        console.log('erro na listagem do estabelcimento ' + error);
        throw responseHandler(error);
    }
};

exports.listarParaAdmin= async () => {
    try {
        return await schemaEstabelecimento.find({}, {nome: 1, celular: 1, telefone: 1, email: 1, status: 1});
    } catch (error) {
        throw responseHandler(error);
    }
};

exports.obterParaAdmin = async (_id) => {
    try {
        return schemaEstabelecimento.findById(_id);
    } catch (error) {
        throw responseHandler(error);
    }
};

exports.obterParaClientes = async (obj) => {

    try {
        return await schemaEstabelecimento.aggregate([
            {
                $match:
                {
                    _id: ObjectIdCast(obj._idEstabelecimento)
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
            { $unwind : { 'path': '$conquistas' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $lookup:
                    {
                        from: 'conquista',
                        localField: 'conquistas',
                        foreignField: '_id',
                        as: 'conquistas'
                    }
            },
            { $unwind : { 'path': '$conquistas' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $match: {
                    $or:[
                        { 'conquistas.status': 1 },
                        { 'conquistas.status': null, }
                    ]

                }
            },
            { $sort : { 'conquistas.tempoDuracao' : -1 } },
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
                    'conquistas': {
                        '$addToSet':'$conquistas'
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

        ]).then(items => items[0]);
    } catch (error) {
        throw responseHandler(error);
    }
};

exports.alterarStatusEstabOnline = async (obj) => {

    const estabelecimento = await schemaEstabelecimento.findById(obj._id);

    estabelecimento.configEstabelecimentoAtual.estaAberta = obj.status;

    if (!obj.status){
        await schemaCliente.updateMany(
            {
                _id: { $in: estabelecimento.configEstabelecimentoAtual.clientesNoLocal }
            },
            {
                $set: { 'configClienteAtual.estaEmUmEstabelecimento': false, 'configClienteAtual.estabelecimento': null}
            });
        estabelecimento.configEstabelecimentoAtual.clientesNoLocal = [];
    }

    return await schemaEstabelecimento.findByIdAndUpdate(estabelecimento._id, estabelecimento).then(() => {
        return {status: true, msg: (obj.status) ? 'ESTABELECIMENTO_ABERTO' : 'ESTABELECIMENTO_FECHADO'};
    }).catch(err => {
        throw responseHandler(err);
    });
};

exports.alterarStatusEntregaItem = async (obj) => {

    const { schemaHistoricoCompraLojas } = require('../../../schema/api/historicoCompraLojas');

    const historicoCompra = await schemaHistoricoCompraLojas.findById(obj.idHistoricoCompra);

    historicoCompra.infoEntrega.jaEntregue = true;
    historicoCompra.infoEntrega.dataEntrega = new Date();

    return await schemaHistoricoCompraLojas.findByIdAndUpdate(historicoCompra._id, historicoCompra).then(() => {
        return {status: true, msg: 'ITEM_ENTREGUE'};
    }).catch(err => {
        throw responseHandler(err);
    });
};

exports.adicionarClienteAoEstabelecimento = async (obj) => {
    const estabelecimento = await schemaEstabelecimento.findById(obj._idEstabelecimento);
    const cliente = await schemaCliente.findById(obj._idCliente);

    if (cliente.configClienteAtual.estaEmUmEstabelecimento)
        return {status: true, msg: 'CLIENTE_JA_ESTA_NO_ESTABELECIMENTO'};

    cliente.configClienteAtual.estaEmUmEstabelecimento = true;
    cliente.configClienteAtual.estabelecimento = estabelecimento._id;

    if (estabelecimento.configEstabelecimentoAtual.estaAberta){

        return await schemaCliente.findByIdAndUpdate(cliente._id, cliente).then(async () => {
            estabelecimento.configEstabelecimentoAtual.clientesNoLocal.push(obj._idCliente);
            try {
                await schemaEstabelecimento.findByIdAndUpdate(estabelecimento._id, estabelecimento);

                return { status: true, msg: 'NOVO_CLIENTE_ADICIONADO' };
            }
            catch (err) {
                throw responseHandler(err);
            }
        }).catch(err => {
            throw responseHandler(err);
        });
    }

    return {status: true, msg: 'ESTABELECIMENTO_FECHADO'};
};

exports.inserirItemNaLojaDoEstabelecimento = async (obj) => {

    const estabelecimento = await schemaEstabelecimento.findById(obj.idEstabelecimento);

    estabelecimento.itensLoja.push({item: obj.idItemLoja, quantidadeDisponivel: obj.quantidade, tempoDisponivel: obj.tempoDisponivel});

    return schemaEstabelecimento.findByIdAndUpdate(estabelecimento._id, estabelecimento).then(() => {
        return estabelecimento;
    }).catch(err => {
        throw responseHandler(err);
    });
};