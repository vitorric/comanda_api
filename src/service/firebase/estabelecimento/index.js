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

        return await connFb.database().ref().update(updates);
    }
    catch(error)
    {
        console.log(error);
    }
};

exports.AdicionarItemEstabelecimento = (estabelecimentoId, { _id, icon, preco, quantidadeVendida, hotSale, quantidadeDisponivel, nome, descricao, tempoDisponivel } ) => {
    try
    {
        let item = {
            icon: icon,
            preco: preco,
            quantidadeVendida: quantidadeVendida,
            hotSale: hotSale,
            quantidadeDisponivel: quantidadeDisponivel,
            _id: _id.toString(),
            nome: nome,
            descricao: descricao,
            tempoDisponivel: tempoDisponivel.toISOString().slice(0,10)
        };

        connFb.database().ref('estabelecimentos').child(estabelecimentoId.toString()).child('itensLoja').child(item._id).set(item);
    }
    catch(error){
        console.log(error);
    }
};