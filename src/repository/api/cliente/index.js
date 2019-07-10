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
                                level:1,
                                exp:1,
                                expProximoLevel: 1,
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
                    dataNascimento: { $dateToString: { format: '%Y-%m-%d', date: '$dataNascimento' } },
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
        return schemaCliente.findOne({_id: clienteId}).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterClienteCompleto:', error);
    }
};

exports.obterClienteChaveUnica = chaveAmigavel => {
    try {
        return schemaCliente.findOne({chaveAmigavel: chaveAmigavel}).exec();
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
                    goldPorEstabelecimento: 1
                }
            }]).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarClientesParaDesafios:', error);
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
                    'configClienteAtual.estaEmUmEstabelecimento': configClienteAtual.estaEmUmEstabelecimento,
                    'configClienteAtual.conviteEstabPendente': configClienteAtual.conviteEstabPendente,
                    'configClienteAtual.estabelecimento': configClienteAtual.estabelecimento,
                    'configClienteAtual.nomeEstabelecimento': configClienteAtual.nomeEstabelecimento,
                    'configClienteAtual.comanda': configClienteAtual.comanda
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

exports.alterarGoldsEstabelecimento = async (clienteId, goldPorEstabelecimento) => {

    try{
        let clienteAlterado = await schemaCliente.findOneAndUpdate(
            {
                _id: ObjectIdCast(clienteId)
            },
            {
                $set: {
                    goldPorEstabelecimento: goldPorEstabelecimento
                }
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

exports.removerTodosOsClientesDeUmEstabelecimento = async clientes => {
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

//---------------------------------------------------------------------- REFAZER PRA BAIXO

exports.listarClienteDesafios = async (query) => {
    try {
        return await schemaCliente.aggregate([
            {
                $match:
                {
                    'desafios.estabelecimento': ObjectIdCast(query._idEstabelecimento),
                    '_id': ObjectIdCast(query._idCliente)
                }
            },
            {
                $project:{
                    'desafios': 1
                }
            }
        ]);

    } catch (error) {
        throw error;
    }
};