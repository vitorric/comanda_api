const connFb = require('../../../conn/firebase');

exports.FBCadastrarComanda = (comanda, clienteApelido, clienteId, avatarId, clienteSexo, configCliente) => {
    try
    {
        let membro = [];
        console.log(comanda, clienteApelido, clienteId, avatarId, clienteSexo, configCliente);
        comanda.grupo.map((value) => {
            membro = {
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
            };
        });

        let novaComanda =
        {
            _id: comanda._id.toString(),
            estabelecimento: comanda.estabelecimento.toString(),
            valorTotal: comanda.valorTotal
        };

        let configClienteAtual = {
            estaEmUmEstabelecimento: configCliente.estaEmUmEstabelecimento,
            conviteEstabPendente: configCliente.conviteEstabPendente,
            estabelecimento: (typeof configCliente.estabelecimento !== 'undefined' && configCliente.estabelecimento !== null) ? configCliente.estabelecimento.toString() : '',
            nomeEstabelecimento: (typeof configCliente.nomeEstabelecimento !== 'undefined' && configCliente.nomeEstabelecimento !== null) ? configCliente.nomeEstabelecimento : '',
            comanda: configCliente.comanda.toString()
        };

        connFb.database().ref('/comandas/' + comanda._id.toString()).set(novaComanda);
        connFb.database().ref('/comandas/' + comanda._id.toString() + '/grupo/' + membro.cliente._id.toString()).set(membro);
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
        let membro = {};
        comanda.grupo.map((value) => {
            membro = {
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
            };

            connFb.database().ref('/comandas/' + comanda._id.toString() + '/grupo/' + membro.cliente._id.toString()).set(membro);
        });

        let configClienteAtual = {
            estaEmUmEstabelecimento: configCliente.estaEmUmEstabelecimento,
            conviteEstabPendente: configCliente.conviteEstabPendente,
            estabelecimento: configCliente.estabelecimento.toString(),
            nomeEstabelecimento: configCliente.nomeEstabelecimento,
            comanda: configCliente.comanda.toString()
        };

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
        let membro = {};

        comanda.grupo.map((value) => {
            membro = {
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
            };

            connFb.database().ref('/comandas/' + comanda._id.toString() + '/grupo/' + membro.cliente._id.toString()).set(membro);
        });

    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};

exports.FBAlterarProdutosComanda = (comanda, valorTotal) => {
    try
    {
        let produto = {};

        comanda.produtos.map((value) => {
            produto = {
                preco: value.preco,
                quantidade: value.quantidade,
                produto: {
                    _id: value.produto._id.toString(),
                    nome: value.produto.nome
                },
                precoTotal: value.precoTotal
            };

            if (value.produto.icon)
                produto.produto.icon = value.produto.icon;

            connFb.database().ref('/comandas/' + comanda._id.toString() + '/produtos/' + value.produto._id.toString()).set(produto);
        });

        connFb.database().ref('/comandas/' + comanda._id.toString() + '/valorTotal').set(valorTotal);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};

exports.FBRemoverComanda = comandaId => {
    try
    {
        connFb.database().ref('/comandas').child(comandaId.toString()).remove();
    }
    catch(error){
        console.log(error);
    }
};