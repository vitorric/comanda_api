const { listarItemLoja } = require('../../../../repository/api/itemLoja');

exports.ListarItemLoja = async (obj) => {
    return await listarItemLoja(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        console.log('registerUser errr:', err);
        return { status: false, msg: !err ? 'REGISTRATION_ERROR_EMAIL' : 'REGISTRATION_ERROR_USER' };
    });
};