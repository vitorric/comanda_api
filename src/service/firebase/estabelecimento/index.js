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
            preco: preco,
            quantidadeVendida: quantidadeVendida,
            hotSale: hotSale,
            quantidadeDisponivel: quantidadeDisponivel,
            _id: _id.toString(),
            nome: nome,
            descricao: descricao,
            tempoDisponivel: tempoDisponivel.toISOString()
        };

        if (typeof icon !== 'undefined')
            item.icon = icon;

        connFb.database().ref('estabelecimentos').child(estabelecimentoId.toString()).child('itensLoja').child(item._id).set(item);
    }
    catch(error){
        console.log(error);
    }
};

exports.FBRemoverItemEstabelecimento = (estabelecimentoId, itemId ) => {
    try
    {
        connFb.database().ref('estabelecimentos').child(estabelecimentoId.toString()).child('itensLoja').child(itemId.toString()).remove();
    }
    catch(error){
        console.log(error);
    }
};

exports.FBAlterarItemEstabelecimento = (estabelecimentoId, {_id, descricao, hotSale, nome, preco, quantidadeDisponivel, quantidadeVendida, tempoDisponivel} ) => {
    try
    {
        let item = {
            _id,
            descricao,
            hotSale,
            nome,
            preco,
            quantidadeDisponivel,
            quantidadeVendida,
            tempoDisponivel
        };

        connFb.database().ref('estabelecimentos/' + estabelecimentoId.toString() +'/itensLoja/' + item._id.toString()).update(item);
    }
    catch(error){
        console.log(error);
    }
};

exports.FBAlterarEstoqueItem = (estabelecimentoId, {_id, quantidadeDisponivel, quantidadeVendida} ) => {
    try
    {
        let item = {
            _id,
            quantidadeDisponivel,
            quantidadeVendida
        };

        connFb.database().ref('estabelecimentos/' + estabelecimentoId.toString() +'/itensLoja/' + item._id.toString()).update(item);
    }
    catch(error){
        console.log(error);
    }
};

exports.FBCadastrarDesafio = (estabelecimentoId, produtoPremioId, produtoObjetivoId, {_id,nome,descricao,icon,tempoDuracao,emGrupo,premio,objetivo}) => {
    try
    {
        let desafio = {
            _id: _id.toString(),
            nome: nome,
            descricao: descricao,
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

        if (typeof icon !== 'undefined')
            desafio.icon = icon;

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

exports.FBRemoverDesafio = (estabelecimentoId, desafioId) => {
    try
    {
        connFb.database().ref('estabelecimentos').child(estabelecimentoId.toString()).child('desafios').child(desafioId.toString()).remove();
    }
    catch(error){
        console.log(error);
    }
};

exports.FBAlterarIconDesafio = (estabelecimentoId, desafioId, nomeIcon) => {
    try
    {
        connFb.database().ref('estabelecimentos/' + estabelecimentoId.toString() +'/desafios/' + desafioId.toString() + '/icon').set(nomeIcon);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};

exports.FBAlterarIconItemLoja = (estabelecimentoId, itemLojaId, nomeIcon) => {
    try
    {
        connFb.database().ref('estabelecimentos/' + estabelecimentoId.toString() +'/itensLoja/' + itemLojaId.toString() + '/icon').set(nomeIcon);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};

exports.FBAlterarDesafio = (estabelecimentoId, {_id, nome, descricao, tempoDuracao}) => {
    try
    {
        let desafio = {
            _id,
            nome,
            descricao,
            tempoDuracao
        };

        connFb.database().ref('estabelecimentos/' + estabelecimentoId.toString() +'/desafios/' + desafio._id.toString()).update(desafio);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};