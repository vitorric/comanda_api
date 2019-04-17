const { loginEstabelecimento } = require('../../../../repository/api/estabelecimento');

exports.LoginEstabelecimento = async (obj) => {
    return await loginEstabelecimento(obj).then(result => {
        let resulObj = !result ? { msg: 'NO_FOUND_USER' } : result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        console.log('registerUser errr:', err);
        return { status: false, msg: !err ? 'REGISTRATION_ERROR_EMAIL' : 'REGISTRATION_ERROR_USER' };
    });
};