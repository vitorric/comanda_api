const { obterEstabelecimentoViaToken } = require('../../../../repository/api/estabelecimento');

exports.ObterEstabelecimentoViaToken = async (obj) => {
    return await obterEstabelecimentoViaToken(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        console.log('registerUser errr:', err);
        return { status: false, msg: !err };
    });
};