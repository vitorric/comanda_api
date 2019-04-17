const { cadastrarComanda } = require('../../../../repository/api/comanda');

exports.CadastrarComanda = async (obj) => {
    return await cadastrarComanda(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        return { status: false, msg: err };
    });
};