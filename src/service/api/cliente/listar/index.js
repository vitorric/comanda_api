const { listar } = require('../../../../repository/api/cliente');

exports.ListarClientes = async () => {
    return await listar().then(result => {
        let resulObj = !result ? { msg: 'NO_FOUND_USER' } : result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        console.log('registerUser errr:', err);
        return { status: false, msg: !err ? 'REGISTRATION_ERROR_EMAIL' : 'REGISTRATION_ERROR_USER' };
    });
};