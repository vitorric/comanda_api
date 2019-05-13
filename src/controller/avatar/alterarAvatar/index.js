const { alterarAvatar } = require('../../../repository/api/avatar'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    let avatar = req.body;

    if (!avatar._idCliente ||
        !avatar.corpo ||
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
    {
        // eslint-disable-next-line no-undef
        resJsonP(res, 200, false, {mensagem: Mensagens.AVATAR_ALTERAR_ERRO});
        return;
    }

    alterarAvatar(avatar).then((result) => resJsonP(res, 200, true, result))
        .catch((err) => resJsonP(res, 200, false, err.message));
};