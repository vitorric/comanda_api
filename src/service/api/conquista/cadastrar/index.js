const { cadastrarConquista } = require('../../../../repository/api/conquista');

exports.CadastrarConquista = async (obj) => {
    return await cadastrarConquista(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        return { status: false, msg: err };
    });
};