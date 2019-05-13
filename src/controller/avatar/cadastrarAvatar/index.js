const { cadastrarAvatar } = require('../../../repository/api/avatar');

module.exports = () => async (avatar) => {

    if (!avatar.corpo ||
        !avatar.cabeca ||
        !avatar.nariz ||
        !avatar.olhos ||
        !avatar.boca ||
        !avatar.roupa ||
        !avatar.cabeloTraseiro ||
        !avatar.cabeloFrontal ||
        !avatar.barba ||
        !avatar.sombrancelhas ||
        !avatar.orelha ||
        !avatar.corPele ||
        !avatar.corCabelo ||
        !avatar.corBarba)
        return false;

    return await cadastrarAvatar(avatar).then((result) => {
        return result;
    }).catch(error => {
        console.log(error);
        return false;
    });
};