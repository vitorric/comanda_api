const connFb = require('../../../conn/firebase');

exports.FBCriarCliente = async (cliente) => {
    try
    {
        return await connFb.database().ref('clientes').child(cliente._id).set(cliente);
    }
    catch(err)
    {
        console.log(err);
    }
};

exports.FBEntrarNoEstabelecimento = async (_idCliente, _idEstabelecimento, nomeEstabelecimento) => {
    try
    {

        let configAtualCliente = {
            estaEmUmEstabelecimento: true,
            conviteEstabPendente: false,
            estabelecimento: _idEstabelecimento,
            nomeEstabelecimento: nomeEstabelecimento
        };

        var updates = {};
        updates['/clientes/' + _idCliente + '/configClienteAtual'] = configAtualCliente;

        return await connFb.database().ref().update(updates);
    }
    catch(err)
    {
        console.log(err);
    }
};

exports.FBRecusarSairDoEstabelecimento = async (_idCliente) => {
    try
    {

        let configAtualCliente = {
            estaEmUmEstabelecimento: false
        };

        var updates = {};
        updates['/clientes/' + _idCliente + '/configClienteAtual'] = configAtualCliente;

        return await connFb.database().ref().update(updates);
    }
    catch(err)
    {
        console.log(err);
    }
};