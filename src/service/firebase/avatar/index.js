const connFb = require('../../../conn/firebase');

exports.FBAlterarAvatar = (_idCliente, avatar) => {
    try
    {

        var updates = {};
        updates['/clientes/' + _idCliente + '/avatar/corpo'] = avatar.corpo;
        updates['/clientes/' + _idCliente + '/avatar/cabeca'] = avatar.cabeca;
        updates['/clientes/' + _idCliente + '/avatar/nariz'] = avatar.nariz;
        updates['/clientes/' + _idCliente + '/avatar/olhos'] = avatar.olhos;
        updates['/clientes/' + _idCliente + '/avatar/boca'] = avatar.boca;
        updates['/clientes/' + _idCliente + '/avatar/roupa'] = avatar.roupa;
        updates['/clientes/' + _idCliente + '/avatar/cabeloTraseiro'] = avatar.cabeloTraseiro;
        updates['/clientes/' + _idCliente + '/avatar/cabeloFrontal'] = avatar.cabeloFrontal;
        updates['/clientes/' + _idCliente + '/avatar/barba'] = avatar.barba;
        updates['/clientes/' + _idCliente + '/avatar/sombrancelhas'] = avatar.sombrancelhas;
        updates['/clientes/' + _idCliente + '/avatar/orelha'] = avatar.orelha;
        updates['/clientes/' + _idCliente + '/avatar/corPele'] = avatar.corPele;
        updates['/clientes/' + _idCliente + '/avatar/corCabelo'] = avatar.corCabelo;
        updates['/clientes/' + _idCliente + '/avatar/corBarba'] = avatar.corBarba;


        connFb.database().ref().update(updates);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};