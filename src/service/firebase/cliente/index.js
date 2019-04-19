const connFb = require('../../../conn/firebase');

exports.Criar = async (cliente) => {
    try
    {
        return await connFb.database().ref('clientes').child(cliente._id).set(cliente);
    }
    catch(err)
    {
        console.log(err);
    }
};

exports.StatusEstaEmEstabelecimento = async (_idCliente, entrou, _idEstabelecimento, nomeEstabelecimento) => {
    try
    {

        let configAtualCliente = {
            estaEmUmEstabelecimento: entrou,
            estabelecimento: _idEstabelecimento,
            nomeEstabelecimento: nomeEstabelecimento
        };

        var updates = {};
        //updates['/posts/' + newPostKey] = postData;
        updates['/clientes/' + _idCliente + '/configClienteAtual'] = configAtualCliente;

        return await connFb.database().ref().update(updates);
    }
    catch(err)
    {
        console.log(err);
    }
};