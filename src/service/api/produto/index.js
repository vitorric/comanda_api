const { cadastrarProduto, listarProdutos } = require('../../../repository/api/produto'),
    { obterEstabelecimento, adicionarProdutoAoEstabelecimento } = require('../../../repository/api/estabelecimento');

exports.CadastrarProduto = async (estabelecimentoId, produto) => {

    try
    {
        if (!produto.nome)
        // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };


        let estabelecimento = await obterEstabelecimento(estabelecimentoId);

        if (!estabelecimento)
        // eslint-disable-next-line no-undef
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

            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarProduto:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }

};

exports.ListarProdutos = async (estabelecimentoId, nome) => {

    let nomeProd = (!nome) ? '' : nome;

    try
    {
        let produtos = await listarProdutos(estabelecimentoId, nomeProd);

        if (!produtos)
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };

        return { status: true, objeto: produtos };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarProdutos:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};