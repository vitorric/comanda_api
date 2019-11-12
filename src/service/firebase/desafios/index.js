const connFb = require('../../../conn/firebase');

exports.FBAlterarDesafios = (clienteId, desafios) => {
    try
    {
        desafios.map((value) => {

            let novoDesafio = {
                _id: value.desafio._id.toString(),
                progresso: value.progresso,
                estabelecimento: value.estabelecimento.toString(),
                resgatouPremio: false,
                concluido: false,
                desafio: {
                    _id: value.desafio._id.toString(),
                    nome: value.desafio.nome,
                    tempoDuracao: value.desafio.tempoDuracao
                }
            };

            if (typeof value.desafio.icon !== 'undefined'){
                novoDesafio.desafio.icon = value.desafio.icon;
            }

            if (value.premio)
                novoDesafio.premio = {
                    tipo: value.premio.tipo,
                    quantidade: value.premio.quantidade
                };

            if (typeof value.premio.produto !== 'undefined')
            {
                novoDesafio.premio.produto = {
                    _id: value.premio.produto._id.toString(),
                    nome: value.premio.produto.nome,
                    icon: value.premio.produto.icon
                };
            }

            if (typeof value.premio.ganhador !== 'undefined')
            {
                novoDesafio.premio.ganhador = {
                    _id: value.premio.ganhador._id.toString(),
                    nome: value.premio.ganhador.nome
                };
            }

            if (value.resgatouPremio)
                novoDesafio.resgatouPremio = value.resgatouPremio;

            if (value.concluido)
                novoDesafio.concluido = value.concluido;

            if (value.dataConclusao)
                novoDesafio.dataConclusao = value.dataConclusao;

            connFb.database().ref('/desafios/' + clienteId + '/' + novoDesafio._id).set(novoDesafio);
        });

    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};

exports.FBAlterarDesafioResgatouPremio = (clienteId, desafioId) => {
    try
    {
        connFb.database().ref('/desafios/' + clienteId.toString() + '/' + desafioId.toString() + '/resgatouPremio').set(true);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};

exports.FBDeletarDesafios = (clientesId, desafios) => {
    try{

        clientesId.forEach((cliente) => {
            desafios.forEach((element) => {
                connFb.database().ref('/desafios/' + cliente.toString() + '/' + element._id.toString()).remove();
            });
        });
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};