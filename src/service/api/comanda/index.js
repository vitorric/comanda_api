const { cadastrarComanda, cadastrarItemComanda } = require('../../../repository/api/comanda');

exports.CadastrarComanda = async (obj) => {
    return await cadastrarComanda(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        return { status: false, msg: err };
    });
};

exports.CadastrarItemComanda = async (obj) => {
    return await cadastrarItemComanda(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        return { status: false, msg: err };
    });
};