const { entrarNoEstabelecimento } = require('../../../../repository/api/cliente');

exports.EntrarNoEstabelecimento = async (obj) => {
    return await entrarNoEstabelecimento(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        return { status: false, msg: err === 0 ? 'REGISTRATION_ERROR_EMAIL' : 'REGISTRATION_ERROR_USER' };
    });
};