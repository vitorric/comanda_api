const { recusarConviteEstabelecimento } = require('../../../../repository/api/cliente');

exports.RecusarConviteEstabelecimento = async (obj) => {
    return await recusarConviteEstabelecimento(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        return { status: false, msg: err};
    });
};