const connFb = require('../../../conn/firebase');

exports.FBCriarCliente = async (cliente) => {
    try
    {
        return await connFb.database().ref('clientes').child(cliente._id).update(cliente);
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

exports.FBEntrarNoEstabelecimento = async (clienteId, _idEstabelecimento, nomeEstabelecimento, comandaId) => {
    try
    {
        console.log(clienteId, _idEstabelecimento, nomeEstabelecimento, comandaId);
        let configAtualCliente = {
            estaEmUmEstabelecimento: true,
            conviteEstabPendente: false,
            estabelecimento: _idEstabelecimento,
            nomeEstabelecimento: nomeEstabelecimento
        };

        if (typeof comandaId !== 'undefined' && comandaId !== null)
            configAtualCliente.comanda = comandaId.toString();

        console.log(configAtualCliente);
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

exports.FBEntrarNoEstabelecimento = async (clienteId, _idEstabelecimento, nomeEstabelecimento, comandaId) => {
    try
    {
        console.log(clienteId, _idEstabelecimento, nomeEstabelecimento, comandaId);
        let configAtualCliente = {
            estaEmUmEstabelecimento: true,
            conviteEstabPendente: false,
            estabelecimento: _idEstabelecimento,
            nomeEstabelecimento: nomeEstabelecimento
        };

        if (typeof comandaId !== 'undefined' && comandaId !== null)
            configAtualCliente.comanda = comandaId.toString();

        console.log(configAtualCliente);
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

exports.FBSairDoEstabelecimento = async clienteId => {
    try
    {
        let configAtualCliente = {
            estaEmUmEstabelecimento: false,
            conviteEstabPendente: false
        };

        connFb.database().ref('/clientes/' + clienteId.toString() + '/configClienteAtual').set(configAtualCliente);
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

exports.FBAlterarConvitesComanda = async (clienteId, convitesComanda) => {
    try
    {
        let convites = [];

        convitesComanda.map((value) => {
            convites.push({
                liderComanda: value.liderComanda.toString(),
                comanda: value.comanda.toString(),
                dataConvite: value.dataConvite.toISOString()
            });
        });

        connFb.database().ref('/clientes/' + clienteId.toString() + '/configClienteAtual/convitesComanda').set(convites);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};

exports.FBLimparConvites = async (clienteId) =>
{
    try
    {
        connFb.database().ref('/clientes/' + clienteId.toString() + '/configClienteAtual/convitesComanda').remove();
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
