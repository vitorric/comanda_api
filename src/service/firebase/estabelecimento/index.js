const connFb = require('../../../conn/firebase');

exports.FBAdicionarClienteAoEstabelecimento = async (clienteId, estabelecimentoId, nomeEstabelecimento) => {
    try
    {
        let configAtualCliente = {
            estaEmUmEstabelecimento: false,
            conviteEstabPendente: true,
            estabelecimento: estabelecimentoId.toString(),
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

exports.FBAdicionarItemEstabelecimento = (estabelecimentoId, { _id, icon, preco, quantidadeVendida, hotSale, quantidadeDisponivel, nome, descricao, tempoDisponivel } ) => {
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
            tempoDisponivel: tempoDisponivel.toISOString()
        };

        connFb.database().ref('estabelecimentos').child(estabelecimentoId.toString()).child('itensLoja').child(item._id).set(item);
    }
    catch(error){
        console.log(error);
    }
};


exports.FBCadastrarDesafio = (estabelecimentoId,
    produtoPremioId,
    produtoObjetivoId,
    {
        _id,
        nome,
        descricao,
        icon,
        tempoDuracao,
        emGrupo,
        premio,
        objetivo
    }) => {
    try
    {
        let desafio = {
            _id: _id.toString(),
            nome: nome,
            descricao: descricao,
            icon: icon,
            premio: {
                quantidade: premio.quantidade,
                tipo: premio.tipo
            },
            emGrupo: emGrupo,
            objetivo: {
                quantidade: objetivo.quantidade,
                tipo: objetivo.tipo
            },
            tempoDuracao: tempoDuracao.toISOString()
        };

        if (produtoObjetivoId){
            desafio.objetivo.produto = produtoObjetivoId.toString();
        }

        if (produtoPremioId){
            desafio.premio.produto = produtoPremioId.toString();
        }

        connFb.database().ref('estabelecimentos').child(estabelecimentoId.toString()).child('desafios').child(desafio._id.toString()).set(desafio);
    }
    catch(error){
        console.log(error);
    }
};