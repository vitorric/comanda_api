const connFb = require('../../../conn/firebase');

exports.AdicionarClienteAoEstabelecimento = async (_idCliente, _idEstabelecimento, nomeEstabelecimento) => {
    try
    {
        let configAtualCliente = {
            estaEmUmEstabelecimento: false,
            conviteEstabPendente: true,
            estabelecimento: _idEstabelecimento,
            nomeEstabelecimento: nomeEstabelecimento
        };

        var updates = {};
        updates['/clientes/' + _idCliente + '/configClienteAtual'] = configAtualCliente;
        console.log(updates);
        return await connFb.database().ref().update(updates);
    }
    catch(err)
    {
        console.log(err);
    }
};