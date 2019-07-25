const   { cadastrarItemLoja,
        listarItemLoja,
        obterItemLoja,
        alterarItemLoja } = require('../../../repository/api/itemLoja'),
    { obterEstabelecimento, adicionarItemNaLojaDoEstabelecimento } = require('../../../repository/api/estabelecimento'),
    { FBAdicionarItemEstabelecimento } = require('../../firebase/estabelecimento');

exports.CadastrarItemLoja = async (estabelecimentoId, item) =>
{
    try
    {
        if (!estabelecimentoId ||
            !item.nome ||
            !item.produto ||
            !item.tempoDisponivel)
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let estabelecimento = await obterEstabelecimento(estabelecimentoId);

        if (!estabelecimento)
        // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        item.estabelecimento = estabelecimentoId;

        let novoItem = await cadastrarItemLoja(item);

        if (!novoItem){
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        estabelecimento.itensLoja.push(novoItem._id);

        let itemAdicionado = await adicionarItemNaLojaDoEstabelecimento(estabelecimentoId, estabelecimento.itensLoja);

        if (!itemAdicionado)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        FBAdicionarItemEstabelecimento(estabelecimentoId, novoItem);

        return { status: true , objeto: novoItem};
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarItemLoja:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.AlterarItemLoja = async (item) =>
{
    try
    {
        if (!item._id ||
            !item.nome ||
            !item.tempoDisponivel)
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let itemAlterado = await alterarItemLoja(item);

        if (!itemAlterado)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        return { status: true };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarItemLoja:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};


exports.ListarItemLoja = async (estabelecimentoId, nomeItem) => {
    try
    {
        if (!estabelecimentoId)
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let itens = await listarItemLoja(estabelecimentoId, (!nomeItem) ? '' : nomeItem);

        if (!itens)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        return { status: true, objeto: itens} ;
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarItemLoja:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ObterItemLoja = async (estabelecimentoId, itemId) => {
    try
    {
        if (!estabelecimentoId || !itemId)
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let item = await obterItemLoja(estabelecimentoId, itemId);

        if (!item)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        return { status: true, objeto: item} ;
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterItemLoja:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};