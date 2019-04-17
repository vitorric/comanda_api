const { cadastrarItemComanda } = require('../../../../repository/api/comanda');

exports.CadastrarItemComanda = async (obj) => {
    return await cadastrarItemComanda(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        return { status: false, msg: err };
    });
};