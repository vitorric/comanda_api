const { listarClienteConquistas } = require('../../../../repository/api/cliente');

exports.ListarClienteConquistas = async (obj) => {
    return await listarClienteConquistas(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        console.log('registerUser errr:', err);
        return { status: false, msg: err };
    });
};