const connFb = require('../../../conn/firebase');

exports.FBCriarCliente = async (cliente) => {
    try
    {
        return await connFb.database().ref('clientes').child(cliente._id).set(cliente);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};

exports.FBAlterarCliente = async (clienteId, cliente) => {
    try
    {
        var updates = {};
        updates['/clientes/' + clienteId + '/nome'] = cliente.nome;
        updates['/clientes/' + clienteId + '/cpf'] = cliente.cpf;
        updates['/clientes/' + clienteId + '/dataNascimento'] = cliente.dataNascimento;

        connFb.database().ref().update(updates);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};

exports.FBEntrarNoEstabelecimento = async (clienteId, _idEstabelecimento, nomeEstabelecimento) => {
    try
    {

        let configAtualCliente = {
            estaEmUmEstabelecimento: true,
            conviteEstabPendente: false,
            estabelecimento: _idEstabelecimento,
            nomeEstabelecimento: nomeEstabelecimento
        };

        var updates = {};
        updates['/clientes/' + clienteId + '/configClienteAtual'] = configAtualCliente;

        return await connFb.database().ref().update(updates);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};

exports.FBRecusarSairDoEstabelecimento = async (clienteId) => {
    try
    {

        let configAtualCliente = {
            estaEmUmEstabelecimento: false
        };

        var updates = {};
        updates['/clientes/' + clienteId + '/configClienteAtual'] = configAtualCliente;

        return await connFb.database().ref().update(updates);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};

exports.FBAlterarConfigApp = (clienteId, configApp) => {
    try
    {
        var updates = {};
        updates['/clientes/' + clienteId + '/configApp/somFundo'] = configApp.somFundo;
        updates['/clientes/' + clienteId + '/configApp/somGeral'] = configApp.somGeral;

        connFb.database().ref().update(updates);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};