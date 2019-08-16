const   { cadastrarItemLoja,
        listarItemLoja,
        obterItemLoja,
        alterarItemLoja,
        alterarItemLojaStatus,
        alterarItemLojaStatusFirebase,
        obterItemLojaStatusFirebase } = require('../../../repository/api/itemLoja'),
    { obterEstabelecimento, adicionarItemNaLojaDoEstabelecimento } = require('../../../repository/api/estabelecimento'),
    { FBRemoverItemEstabelecimento, FBAlterarItemEstabelecimento } = require('../../firebase/estabelecimento');

exports.CadastrarItemLoja = async (estabelecimentoId, item) =>
{
    try
    {
        if (!estabelecimentoId ||
            !item.nome ||
            !item.produto ||
            !item.tempoDisponivel ||
            !item.tempoEntrarNoAr)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let dataEntrar = new Date(item.tempoEntrarNoAr);
        let dataSair = new Date(item.tempoDisponivel);

        if (dataEntrar > dataSair)
            return { status: false , mensagem: Mensagens.DATA_DE_ENTRADA_MENOR_QUE_SAIDA };

        let estabelecimento = await obterEstabelecimento(estabelecimentoId);

        if (!estabelecimento)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        item.estabelecimento = estabelecimentoId;

        let novoItem = await cadastrarItemLoja(item);

        if (!novoItem){
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        estabelecimento.itensLoja.push(novoItem._id);

        let itemAdicionado = await adicionarItemNaLojaDoEstabelecimento(estabelecimentoId, estabelecimento.itensLoja);

        if (!itemAdicionado)
        {
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        //(estabelecimentoId, novoItem);

        return { status: true , objeto: novoItem};
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarItemLoja:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.AlterarItemLoja = async (estabelecimentoId, item) =>
{
    try
    {
        if (!item._id ||
            !item.nome ||
            !item.tempoDisponivel ||
            !item.tempoEntrarNoAr)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let dataEntrar = new Date(item.tempoEntrarNoAr);
        let dataSair = new Date(item.tempoDisponivel);

        if (dataEntrar > dataSair)
            return { status: false , mensagem: Mensagens.DATA_DE_ENTRADA_MENOR_QUE_SAIDA };

        let itemAlterado = await alterarItemLoja(item);

        if (!itemAlterado)
        {
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        if (item.status !== 1)
        {
            alterarItemLojaStatusFirebase(item._id, 0);
            FBRemoverItemEstabelecimento(estabelecimentoId, item._id);
            return { status: true };
        }

        let statusFirebase = await obterItemLojaStatusFirebase(item._id);

        if (statusFirebase === 2)
        {
            alterarItemLojaStatusFirebase(item._id, 0);
        }

        if (item.status === 1 && statusFirebase === 1)
            FBAlterarItemEstabelecimento(estabelecimentoId, item);

        return { status: true };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarItemLoja:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.AlterarItemLojaStatus = async (estabelecimentoId, { itemId, status }) =>
{
    try
    {
        let itemAlterado = await alterarItemLojaStatus(itemId, status);

        if (!itemAlterado)
        {
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        if (status !== 1)
        {
            alterarItemLojaStatusFirebase(itemId, 0);
            FBRemoverItemEstabelecimento(estabelecimentoId, itemId);
            return { status: true };
        }

        return { status: true };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarItemLojaStatus:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ListarItemLoja = async (estabelecimentoId, nomeItem) => {
    try
    {
        if (!estabelecimentoId)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let itens = await listarItemLoja(estabelecimentoId, (!nomeItem) ? '' : nomeItem);

        if (!itens)
        {
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        return { status: true, objeto: itens} ;
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarItemLoja:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ObterItemLoja = async (estabelecimentoId, itemId) => {
    try
    {
        if (!estabelecimentoId || !itemId)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let item = await obterItemLoja(estabelecimentoId, itemId);

        if (!item)
        {
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        return { status: true, objeto: item} ;
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterItemLoja:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};