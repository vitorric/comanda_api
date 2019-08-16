const { alterarAvatar, cadastrarAvatar, obterAvatar, alterarExp } = require('../../../repository/api/avatar'),
    { obterCliente } = require('../../../repository/api/cliente'),
    { alterarAvatarClienteComanda, obterGrupoComanda } = require('../../../repository/api/comanda'),
    { FBAlterarAvatar, FBAlterarAvatarExp } = require('../../firebase/avatar'),
    { FBAlterarGrupoComanda } = require('../../firebase/comanda'),
    { CalcularExpProLvl } = require('../../game'),
    { BASE_EXP } = require('../../../../config/game');

exports.CadastrarAvatar = async (avatar) =>
{

    if (!avatar.corpo ||
        !avatar.cabeca ||
        !avatar.nariz ||
        !avatar.olhos ||
        !avatar.boca ||
        !avatar.roupa ||
        !avatar.sombrancelhas ||
        !avatar.orelha ||
        !avatar.corPele ||
        !avatar.corCabelo)
        return false;

    avatar.info = {};
    avatar.info.expProximoLevel = BASE_EXP;

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
            !avatar.sombrancelhas ||
            !avatar.orelha ||
            !avatar.corPele ||
            !avatar.corCabelo)
        {
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        let cliente = await obterCliente(clienteId);

        let avatarAlterado = await alterarAvatar(avatarId, avatar);

        if (!avatarAlterado)
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };

        if (cliente.configClienteAtual.comanda != null)
        {
            await alterarAvatarClienteComanda(cliente.configClienteAtual.comanda, cliente._id);
            let grupoComandaAlterado = await obterGrupoComanda(cliente.configClienteAtual.comanda);
            FBAlterarGrupoComanda(grupoComandaAlterado);
        }

        FBAlterarAvatar(clienteId, avatar);

        return {status: true};
    }
    catch(error){

        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarAvatar:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ObterAvatar = async (avatarId) => {
    try
    {
        let avatar = await obterAvatar(avatarId);

        if (avatar != null)
            return { status: true, objeto: avatar };
    }
    catch(error){

        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterAvatar:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.AlterarExp = async (clienteId, avatarId, expParaAdicionar) => {
    try
    {
        let avatar = await obterAvatar(avatarId);

        avatar.info.exp += expParaAdicionar;

        if (avatar.info.exp >= avatar.info.expProximoLevel)
        {
            avatar.info.level += 1;
            avatar.info.exp = avatar.info.exp - avatar.info.expProximoLevel;
        }

        avatar.info.expProximoLevel = await CalcularExpProLvl(avatar.info.level);

        await alterarExp(avatarId, avatar.info.exp, avatar.info.expProximoLevel, avatar.info.level);

        FBAlterarAvatarExp(clienteId.toString(), avatar.info.exp, avatar.info.expProximoLevel, avatar.info.level);
        return { status: true };
    }
    catch(error){

        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarExp:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};