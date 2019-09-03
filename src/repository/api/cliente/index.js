/* eslint-disable no-undef */
const { schemaCliente } = require('../../../schema/api/cliente'),
    { ObjectIdCast } = require('../../../utils');

exports.cadastrarCliente = async cliente => {
    try
    {
        let novoCliente = new schemaCliente(cliente);

        return await schemaCliente.create(novoCliente);
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarCliente:', error);
    }
};

exports.obterClienteParaCadastro = (email, apelido) => {
    try {
        return schemaCliente.findOne({
            $or: [{
                'apelido': apelido
            }, {
                'email': email
            }]
        }).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterClienteParaCadastro:', error);
    }
};

exports.obterCliente = clienteId => {

    try {
        return schemaCliente.aggregate([
            {
                $match: {
                    _id: ObjectIdCast(clienteId)
                }
            },
            {
                $lookup: {
                    from: 'avatar',
                    let: { avatarID: '$avatar' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ '$_id', '$$avatarID'],
                                }
                            }
                        },
                        {
                            $project: {
                                _id: {
                                    $toString: '$_id'
                                },
                                info:1,
                                corpo: 1,
                                cabeca: 1,
                                nariz: 1,
                                olhos: 1,
                                boca: 1,
                                roupa: 1,
                                cabeloTraseiro: 1,
                                cabeloFrontal: 1,
                                barba: 1,
                                sombrancelhas: 1,
                                orelha: 1,
                                corPele: 1,
                                corCabelo: 1,
                                corBarba: 1
                            }
                        }

                    ],
                    as: 'avatar'
                }
            },
            { $unwind : { 'path': '$avatar' , 'preserveNullAndEmptyArrays': true} },
            {
                $project: {
                    _id: {
                        $toString: '$_id'
                    },
                    apelido: 1,
                    sexo: 1,
                    email: 1,
                    chaveAmigavel: 1,
                    cpf: 1,
                    nome: 1,
                    status: 1,
                    goldGeral: 1,
                    dataNascimento: { $dateToString: { format: '%Y-%m-%d', date: '$dataNascimento', timezone: 'America/Sao_Paulo' } },
                    avatar: 1,
                    configApp: 1,
                    configClienteAtual: 1
                }
            }
        ]).exec().then(items => items[0]);
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterCliente:', error);
    }
};

exports.obterClienteCompleto = clienteId => {
    try {
        return schemaCliente.findOne({_id: ObjectIdCast(clienteId)}).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterClienteCompleto:', error);
    }
};

exports.obterClienteDesafio = (clienteId, desafioId) => {
    try {
        return schemaCliente.findOne(
            {
                _id: ObjectIdCast(clienteId),
                'desafios.desafio': ObjectIdCast(desafioId)
            }).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterClienteDesafio:', error);
    }
};

exports.obterClienteChaveUnica = chaveAmigavel => {
    try {
        return schemaCliente.findOne({chaveAmigavel: chaveAmigavel}).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterClienteChaveUnica:', error);
    }
};

exports.obterClienteChaveUnicaPortal = chaveAmigavel => {
    try {
        return schemaCliente.findOne({chaveAmigavel: chaveAmigavel},
            {
                nome: 1,
                apelido: 1,
                cpf: 1,
                chaveAmigavel: 1
            }).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterClienteChaveUnica:', error);
    }
};

exports.obterClienteEmail = email => {
    try
    {
        return schemaCliente.findOne({ email: email }).exec();
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterClienteEmail:', error);
    }
};

exports.obterClienteApelido = apelido => {
    try
    {
        return schemaCliente.find({ apelido: { $regex: new RegExp('^' + apelido.toLowerCase(), 'i') }  }).exec();
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterClienteApelido:', error);
    }
};

exports.obterClienteCPF = cpf => {
    try
    {
        return schemaCliente.findOne({ cpf: cpf }).exec();
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterClienteCPF:', error);
    }
};

exports.obterClienteSocialId = socialId => {
    try
    {
        return schemaCliente.findOne({ socialId: socialId }).exec();
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterClienteSocialId:', error);
    }
};

exports.obterUltimaChaveAmigavel = () => {
    try
    {
        return schemaCliente.find({}, {chaveAmigavel: 1, _id: 0})
            .sort({chaveAmigavel: -1})
            .limit(1)
            .exec()
            .then(item => item[0]);
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterClienteEmail:', error);
    }
};

exports.registrarTokenFirebase = async (clienteId, deviceId, tokenFirebase) => {
    try
    {
        let tokenRegistrado = await schemaCliente.updateOne({
            '_id': ObjectIdCast(clienteId),
            'fireBaseToken.deviceId': { $ne: deviceId }
        },
        {
            $push: {
                tokenFirebase: {
                    $each: [{ token: tokenFirebase, deviceId: deviceId }],
                    $sort: { score: -1 }
                }
            }
        }).exec();

        if (!tokenRegistrado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in registrarTokenFirebase:', error);
    }
};

exports.deletarTokenFirebase = async (clienteId, deviceId) => {
    try
    {
        let tokenDeletado = await schemaCliente.updateOne({
            '_id': { $ne: ObjectIdCast(clienteId) },
            'fireBaseToken.deviceId': { $eq: deviceId }
        },
        {
            $pull: {
                tokenFirebase: {
                    deviceId: deviceId,
                }
            }
        }).exec();

        if (!tokenDeletado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in deletarTokenFirebase:', error);
    }
};

exports.listarClientesParaDesafios = async clientes =>
{
    try {
        return await schemaCliente.aggregate([
            {
                $match:
                {
                    _id: {$in: clientes}
                }
            },

            {
                $project: {
                    desafios: 1,
                    goldGeral:1,
                    pontos: 1,
                    goldPorEstabelecimento: 1,
                    avatar: 1
                }
            }]).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarClientesParaDesafios:', error);
    }

};

exports.listarClienteDesafiosConcluidos = async clienteId => {
    try {
        return schemaCliente.aggregate([
            {
                $match: {
                    _id: ObjectIdCast(clienteId)
                }
            },
            {
                $unwind : { 'path': '$desafios' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $match:
                {
                    'desafios.concluido': true
                }
            },
            {
                $lookup: {
                    from: 'desafio',
                    let: { desafioId: '$desafios.desafio' },
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
                                'premio': 1,
                                'objetivo': 1,
                                'pontos': 1
                            }
                        }

                    ],
                    as: 'desafios.desafio'
                }
            },
            {
                $unwind : { 'path': '$desafios.desafio' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $lookup: {
                    from: 'produto',
                    let: { produtoObjId: '$desafios.desafio.objetivo.produto' },
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
                    as: 'desafios.desafio.objetivo.produto'
                }
            },
            {
                $unwind : { 'path': '$desafios.desafio.objetivo.produto' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $lookup: {
                    from: 'produto',
                    let: { produtoPremioId: '$desafios.desafio.premio.produto' },
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
                    as: 'desafios.desafio.premio.produto'
                }
            },
            {
                $unwind : { 'path': '$desafios.desafio.premio.produto' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $lookup: {
                    from: 'estabelecimento',
                    let: { estabelecimentoId: '$desafios.estabelecimento' },
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
                    as: 'desafios.estabelecimento'
                }
            },
            {
                $unwind : { 'path': '$desafios.estabelecimento' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $project :
                {
                    'desafios.dataConclusao': { $dateToString: { format: '%d/%m/%Y %H:%M', date: '$desafios.dataConclusao', timezone: 'America/Sao_Paulo' } },
                    'desafios.desafio': 1,
                    'desafios.estabelecimento': 1
                }
            },
            {
                $group:
                {
                    '_id': '$_id',
                    'desafios': {
                        '$addToSet':'$desafios'
                    }
                }
            }
        ]).exec().then(items => items[0]);
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarDesafiosClienteConcluidos:', error);
    }
};

exports.alterarClienteConfigApp = async (clienteId, somFundo, somGeral) => {

    try
    {
        let clienteAlterado = await schemaCliente.findOneAndUpdate(
            {
                _id: ObjectIdCast(clienteId)
            },
            {
                $set: {
                    'configApp.somFundo': somFundo,
                    'configApp.somGeral': somGeral
                }
            })
            .exec();

        if (!clienteAlterado){
            return false;
        }

        return true;
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarClienteConfigApp:', error);
    }
};

exports.alterarCliente = async (clienteId, cliente) => {

    try {

        let clienteAlterado = await schemaCliente.findOneAndUpdate(
            {
                _id: ObjectIdCast(clienteId)
            },
            {
                $set: {
                    nome: cliente.nome,
                    cpf: cliente.cpf,
                    dataNascimento: cliente.dataNascimento
                }

            }).exec();

        if (!clienteAlterado){
            return false;
        }

        return true;
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarAvatar:', error);
    }
};

exports.alterarSenha = async(clienteId, password) => {

    try {

        let clienteAlterado = await schemaCliente.findOneAndUpdate(
            {
                _id: ObjectIdCast(clienteId)
            },
            {
                $set:
                {
                    password: password
                }

            }).exec();

        if (!clienteAlterado){
            return false;
        }

        return true;
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarSenha:', error);
    }
};

exports.listarClientes = async () => {
    try
    {
        return await schemaCliente.find().exec();
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarClientes:', error);
    }
};

exports.alterarConfigClienteAtual = async (clienteId, configClienteAtual) => {

    try{
        let clienteAlterado = await schemaCliente.findOneAndUpdate(
            {
                _id: ObjectIdCast(clienteId)
            },
            {
                $set: {
                    configClienteAtual: configClienteAtual
                }
            }).exec();

        if (!clienteAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in entrarNoEstabelecimento:', error);
        return false;
    }
};

exports.alterarConfigClienteAtualComanda = async (clienteId, comandaId) => {

    try{
        let clienteAlterado = await schemaCliente.findOneAndUpdate(
            {
                _id: ObjectIdCast(clienteId)
            },
            {
                $set: {
                    'configClienteAtual.comanda': comandaId,
                    'configClienteAtual.convitesComanda': []
                }
            }).exec();

        if (!clienteAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarConfigClienteAtualComanda:', error);
        return false;
    }
};

exports.alterarConfigClienteAtualConvitesComanda = async (clienteId, convitesComanda) => {

    try
    {
        let clienteAlterado = await schemaCliente.findOneAndUpdate(
            {
                _id: ObjectIdCast(clienteId)
            },
            {
                $set: {
                    'configClienteAtual.convitesComanda': convitesComanda
                }
            }).exec();

        if (!clienteAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarConfigClienteAtualComanda:', error);
        return false;
    }

};

exports.obterGoldEstabelecimento = async (clienteId, estabelecimentoId) => {
    try {
        return schemaCliente.findOne({
            _id: ObjectIdCast(clienteId),
            goldPorEstabelecimento:
            {
                $elemMatch: {
                    estabelecimento: ObjectIdCast(estabelecimentoId)
                }
            }}).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterGoldEstabelecimento:', error);
    }
};

exports.alterarGoldsEstabelecimento = async (clienteId, estabelecimentoId, goldNoEstabelecimento) => {

    try{
        let clienteAlterado = await schemaCliente.findOneAndUpdate(
            {
                _id: ObjectIdCast(clienteId),
                goldPorEstabelecimento:
                {
                    $elemMatch: {
                        estabelecimento: ObjectIdCast(estabelecimentoId)
                    }
                }
            },
            {
                $inc: { 'goldPorEstabelecimento.$.gold': goldNoEstabelecimento }
            }).exec();

        if (!clienteAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarGoldsEstabelecimento:', error);
        return false;
    }
};

exports.inserirGoldEstabelecimento = async (clienteId, estabelecimentoId, gold) => {
    try {
        return await schemaCliente.updateOne(
            {
                _id: ObjectIdCast(clienteId)
            },
            {
                $push: {
                    goldPorEstabelecimento: {
                        estabelecimento: ObjectIdCast(estabelecimentoId),
                        gold: gold
                    }
                }
            }).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterGoldEstabelecimento:', error);
    }
};

exports.listarGoldEstabelecimento = async clienteId => {
    try {
        return await schemaCliente.find(
            {
                _id: ObjectIdCast(clienteId)
            },
            {
                _id: 0,
                goldPorEstabelecimento: 1
            }).exec().then(items => items[0]);
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterGoldEstabelecimento:', error);
    }
};

exports.alterarClienteParaDesafio = async (clienteId, cliente) => {

    try
    {
        let clienteAlterado = await schemaCliente.findOneAndUpdate(
            {
                _id: ObjectIdCast(clienteId)
            },
            {
                $set: {
                    desafios: cliente.desafios,
                    pontos: cliente.pontos
                }
            }).exec();

        if (!clienteAlterado)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarClienteParaDesafio:', error);
        return false;
    }
};

exports.listarConvitesComandaEnviados = async (comandaId) => {
    try {
        return await schemaCliente.aggregate([
            {
                $unwind : { 'path': '$configClienteAtual.convitesComanda' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $match:
                    {
                        'configClienteAtual.convitesComanda.comanda': ObjectIdCast(comandaId)
                    }
            },
            {
                $lookup:
                    {
                        from: 'avatar',
                        localField: 'avatar',
                        foreignField: '_id',
                        as: 'avatar'
                    }
            },
            {
                $unwind : { 'path': '$avatar' ,
                    'preserveNullAndEmptyArrays': true}
            },
            {
                $project :
                {
                    avatar:1,
                    apelido: 1,
                    sexo: 1,
                    chaveAmigavel: 1
                }
            },
            { $sort : { 'apelido' : 1 } }
        ]).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarConvitesEnviados:', error);
        throw error;
    }
};

exports.removerClienteEstabelecimento = async clientes => {
    try{

        await schemaCliente.updateMany(
            {
                _id: { $in: clientes }
            },
            {
                $set: {
                    'configClienteAtual.estaEmUmEstabelecimento': false,
                    'configClienteAtual.conviteEstabPendente': false,
                    'configClienteAtual.estabelecimento': null,
                    'configClienteAtual.nomeEstabelecimento': null,
                    'configClienteAtual.comanda': null
                }
            });

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in removerTodosOsClientesDeUmEstabelecimento:', error);
        return false;
    }
};
