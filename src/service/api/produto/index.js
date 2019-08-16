const { cadastrarProduto, listarProdutos, obterProduto, obterProdutoCliente, obterProdutoPorCodigo, alterarProduto } = require('../../../repository/api/produto'),
    { obterEstabelecimento, adicionarProdutoAoEstabelecimento } = require('../../../repository/api/estabelecimento');

exports.CadastrarProduto = async (estabelecimentoId, produto) => {

    try
    {
        if (!produto.nome || !produto.codigo)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let existeProdutoComCodigo = await obterProdutoPorCodigo(produto.codigo);

        if (existeProdutoComCodigo)
            return { status: false , mensagem: Mensagens.JA_EXISTE_PRODUTO_COM_CODIGO };

        let estabelecimento = await obterEstabelecimento(estabelecimentoId);

        if (!estabelecimento)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        produto.estabelecimento = estabelecimentoId;

        let produtoCadastrado = await cadastrarProduto(produto);

        if (produtoCadastrado)
        {
            estabelecimento.produtos.push(produtoCadastrado._id);

            let produtoAlterado = await adicionarProdutoAoEstabelecimento(estabelecimentoId, estabelecimento.produtos);

            if (produtoAlterado)
            {
                return { status: true, objeto: produtoCadastrado };
            }

            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarProduto:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }

};

exports.ObterProduto = async produtoId => {
    try
    {
        let produto = await obterProduto(produtoId);

        return { status: true, objeto: produto };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterProduto:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ObterProdutoCliente = async produtoId => {
    try
    {
        let produto = await obterProdutoCliente(produtoId);

        return { status: true, objeto: produto };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterProdutoCliente:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.AlterarProduto = async produto => {
    try
    {
        let produtoAlterado = await alterarProduto(produto._id, produto);

        if (!produtoAlterado)
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };

        return { status: true };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarProduto:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ListarProdutos = async (estabelecimentoId, nome) => {

    let nomeProd = (!nome) ? '' : nome;

    try
    {
        let produtos = await listarProdutos(estabelecimentoId, nomeProd);

        return { status: true, objeto: produtos };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarProdutos:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};