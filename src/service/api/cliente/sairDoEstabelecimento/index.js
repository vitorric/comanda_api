const { sairDoEstabelecimento } = require('../../../../repository/api/cliente');

exports.SairDoEstabelecimento = async (obj) => {
    return await sairDoEstabelecimento(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        return { status: false, msg: err};
    });
};