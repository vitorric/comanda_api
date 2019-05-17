const connFb = require('../../../conn/firebase');

exports.FBAdicionarClienteAoEstabelecimento = async (clienteId, estabelecimentoId, nomeEstabelecimento) => {
    try
    {
        let configAtualCliente = {
            estaEmUmEstabelecimento: false,
            conviteEstabPendente: true,
            estabelecimento: estabelecimentoId,
            nomeEstabelecimento: nomeEstabelecimento
        };

        var updates = {};
        updates['/clientes/' + clienteId + '/configClienteAtual'] = configAtualCliente;
        console.log(updates);
        return await connFb.database().ref().update(updates);
    }
    catch(err)
    {
        console.log(err);
    }
};