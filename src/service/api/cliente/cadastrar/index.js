const { cadastrarCliente } = require('../../../../repository/api/cliente');

exports.CadastrarCliente = async (obj) => {
    return await cadastrarCliente(obj).then(result => {
        let resulObj = !result ? { msg: 'REGISTRATION_ERROR_EMAIL' } : result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        return { status: false, msg: err === 0 ? 'REGISTRATION_ERROR_EMAIL' : 'REGISTRATION_ERROR_USER' };
    });
};