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

    avatar.expProximoLevel = BASE_EXP;

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
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        let cliente = await obterCliente(clienteId);

        let avatarAlterado = await alterarAvatar(avatarId, avatar);

        if (!avatarAlterado)
            // eslint-disable-next-line no-undef
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
        // eslint-disable-next-line no-undef
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
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.AlterarExp = async (clienteId, avatarId, expParaAdicionar) => {
    try
    {
        let avatar = await obterAvatar(avatarId);

        avatar.exp += expParaAdicionar;

        if (avatar.exp >= avatar.expProximoLevel)
        {
            avatar.level += 1;
            avatar.exp = avatar.exp - avatar.expProximoLevel;
        }

        avatar.expProximoLevel = await CalcularExpProLvl(avatar.level);

        await alterarExp(avatarId, avatar.exp, avatar.expProximoLevel, avatar.level);

        FBAlterarAvatarExp(clienteId, avatarId, avatar.exp, avatar.expProximoLevel, avatar.level);
    }
    catch(error){

        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarExp:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};