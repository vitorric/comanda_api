const connFb = require('../../../conn/firebase');

exports.FBAlterarAvatar = (clienteId, avatar) => {
    try
    {

        var updates = {};
        updates['/clientes/' + clienteId + '/avatar/corpo'] = avatar.corpo;
        updates['/clientes/' + clienteId + '/avatar/cabeca'] = avatar.cabeca;
        updates['/clientes/' + clienteId + '/avatar/nariz'] = avatar.nariz;
        updates['/clientes/' + clienteId + '/avatar/olhos'] = avatar.olhos;
        updates['/clientes/' + clienteId + '/avatar/boca'] = avatar.boca;
        updates['/clientes/' + clienteId + '/avatar/roupa'] = avatar.roupa;
        updates['/clientes/' + clienteId + '/avatar/cabeloTraseiro'] = avatar.cabeloTraseiro;
        updates['/clientes/' + clienteId + '/avatar/cabeloFrontal'] = avatar.cabeloFrontal;
        updates['/clientes/' + clienteId + '/avatar/barba'] = avatar.barba;
        updates['/clientes/' + clienteId + '/avatar/sombrancelhas'] = avatar.sombrancelhas;
        updates['/clientes/' + clienteId + '/avatar/orelha'] = avatar.orelha;
        updates['/clientes/' + clienteId + '/avatar/corPele'] = avatar.corPele;
        updates['/clientes/' + clienteId + '/avatar/corCabelo'] = avatar.corCabelo;
        updates['/clientes/' + clienteId + '/avatar/corBarba'] = avatar.corBarba;

        connFb.database().ref().update(updates);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};


exports.FBAlterarAvatarExp = (clienteId, avatarId, exp, expProximoLevel, level) => {
    try
    {
        var updates = {};
        updates['/clientes/' + clienteId + '/' + avatarId + '/exp'] = exp;
        updates['/clientes/' + clienteId + '/' + avatarId + '/level'] = level;
        updates['/clientes/' + clienteId + '/' + avatarId + '/expProximoLevel'] = expProximoLevel;

        connFb.database().ref().update(updates);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};