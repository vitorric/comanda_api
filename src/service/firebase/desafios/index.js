const connFb = require('../../../conn/firebase');

exports.FBAlterarDesafios = (clienteId, desafios) => {
    try
    {
        desafios.map((value) => {

            let novoDesafio = {
                _id: value.desafio.toString(),
                progresso: value.progresso,
                estabelecimento: value.estabelecimento.toString(),
                resgatouPremio: false,
                concluido: false
            };

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