const { alterarAvatar, cadastrarAvatar } = require('../../../repository/api/avatar'),
    { FBAlterarAvatar } = require('../../firebase/avatar');

exports.CadastrarAvatar = async (avatar) => {

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
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarAvatar:', error);
        return false;
    });
};

exports.AlterarAvatar = async (clienteId, avatarId, avatar) => {

    try{

        if (!avatarId ||
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
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        let avatarAlterado = await alterarAvatar(avatarId, avatar);

        if (!avatarAlterado)
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };

        FBAlterarAvatar(clienteId, avatar);
        return {status: true};
    }
    catch(error){

        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarAvatar:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};