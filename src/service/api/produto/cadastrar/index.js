const { cadastrarProduto } = require('../../../../repository/api/produto');

exports.CadastrarProduto = async (obj) => {
    return await cadastrarProduto(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        return { status: false, msg: err === 0 ? 'REGISTRATION_ERROR_EMAIL' : 'REGISTRATION_ERROR_USER' };
    });
};