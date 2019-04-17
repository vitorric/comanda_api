const connFb = require('../../../conn/firebase');

exports.Criar = async (cliente) => {
    try
    {
        await connFb.database().ref('clientes').child(cliente._id).set(cliente);
    }
    catch(err)
    {
        console.log(err);
    }
};