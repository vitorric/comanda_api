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

exports.obterClienteEmail = email => {
    try {
        return schemaCliente.findOne({ email: email }).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterClienteEmail:', error);
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
                    status: cliente.status,
                    nome: cliente.nome,
                    cpf: cliente.cpf,
                    dataNascimento: cliente.dataNascimento,
                    pontos: cliente.pontos,
                    goldGeral: cliente.goldGeral
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

//---------------------------------------------------------------------- REFAZER PRA BAIXO

exports.listarClienteConquistas = async (query) => {
    try {
        return await schemaCliente.aggregate([
            {
                $match:
                {
                    'conquistas.estabelecimento': ObjectIdCast(query._idEstabelecimento),
                    '_id': ObjectIdCast(query._idCliente)
                }
            },
            {
                $project:{
                    'conquistas': 1
                }
            }
        ]);

    } catch (error) {
        throw error;
    }
};