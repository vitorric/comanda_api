const { listarHistoricoCompra } = require('../../../../repository/api/cliente');

exports.ListarHistoricoCompra = async (obj) => {
    return await listarHistoricoCompra(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        console.log('registerUser errr:', err);
        return { status: false, msg: err };
    });
};