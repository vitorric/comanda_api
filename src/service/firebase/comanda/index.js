const connFb = require('../../../conn/firebase');

exports.FBCadastrarComanda = (comanda, clienteApelido, clienteId, avatarId, clienteSexo, configCliente) => {
    try
    {
        let grupo = [];
        let produtos = [];

        comanda.grupo.map((value) => {
            grupo.push({
                lider: value.lider,
                valorPago: value.valorPago,
                cliente: {
                    apelido: clienteApelido,
                    _id: value.cliente.toString(),
                    avatarId: avatarId.toString(),
                    sexo: clienteSexo
                },
                jaPagou: false,
                avatarAlterado: value.avatarAlterado.toISOString()
            });
        });

        comanda.produtos.map((value) => {
            produtos.push({
                preco: value.preco,
                quantidade: value.quantidade,
                produto: value.produto.toString(),
                precoTotal: value.precoTotal
            });
        });

        let novaComanda =
        {
            _id: comanda._id.toString(),
            estabelecimento: comanda.estabelecimento.toString(),
            valorTotal: comanda.valorTotal,
            grupo: grupo,
            produtos: produtos
        };

        let configClienteAtual = {
            estaEmUmEstabelecimento: configCliente.estaEmUmEstabelecimento,
            conviteEstabPendente: configCliente.conviteEstabPendente,
            estabelecimento: configCliente.estabelecimento.toString(),
            nomeEstabelecimento: configCliente.nomeEstabelecimento,
            comanda: configCliente.comanda.toString()
        };

        connFb.database().ref('/comandas/' + comanda._id.toString()).set(novaComanda);
        connFb.database().ref('/clientes/' + clienteId.toString() + '/configClienteAtual').set(configClienteAtual);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};

exports.FBInserirMembroNoGrupoComanda = (comanda, clienteId, configCliente) => {
    try
    {
        let grupo = [];

        comanda.grupo.map((value) => {
            grupo.push({
                lider: value.lider,
                valorPago: value.valorPago,
                cliente: {
                    apelido: value.cliente.apelido,
                    _id: value.cliente._id.toString(),
                    avatar: value.cliente.avatar.toString(),
                    sexo: value.cliente.sexo
                },
                jaPagou: value.jaPagou,
                avatarAlterado: value.avatarAlterado.toISOString()
            });
        });

        let configClienteAtual = {
            estaEmUmEstabelecimento: configCliente.estaEmUmEstabelecimento,
            conviteEstabPendente: configCliente.conviteEstabPendente,
            estabelecimento: configCliente.estabelecimento.toString(),
            nomeEstabelecimento: configCliente.nomeEstabelecimento,
            comanda: configCliente.comanda.toString()
        };

        connFb.database().ref('/comandas/' + comanda._id.toString() + '/grupo').set(grupo);
        connFb.database().ref('/clientes/' + clienteId.toString() + '/configClienteAtual').set(configClienteAtual);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};

exports.FBAlterarGrupoComanda = (comanda) => {
    try
    {
        let grupo = [];

        comanda.grupo.map((value) => {
            grupo.push({
                lider: value.lider,
                valorPago: value.valorPago,
                cliente: {
                    apelido: value.cliente.apelido,
                    _id: value.cliente._id.toString(),
                    avatar: value.cliente.avatar.toString(),
                    sexo: value.cliente.sexo
                },
                jaPagou: value.jaPagou,
                avatarAlterado: value.avatarAlterado.toISOString()
            });
        });


        connFb.database().ref('/comandas/' + comanda._id.toString() + '/grupo').set(grupo);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};