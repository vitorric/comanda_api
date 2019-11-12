const { alterarDesafioIcon, obterDesafioStatusFirebase } = require('../../../repository/api/desafio'),
    { alterarProdutoIcon } = require('../../../repository/api/produto'),
    { alterarEstabelecimentoIcon } = require('../../../repository/api/estabelecimento'),
    { alterarItemLojaIcon, obterItemLojaStatusFirebase } = require('../../../repository/api/itemLoja'),
    { FBAlterarIconDesafio, FBAlterarIconItemLoja } = require('../../../service/firebase/estabelecimento');

exports.UploadIconDesafio = async (estabelecimentoId, desafioId, file) => {
    try
    {
        file.name = `${estabelecimentoId}_${desafioId}.png`;
        const path = `files/desafio/icon/${file.name}`;
        const fullPath = `${__dirname}/../../../../public/${path}`;
        file.mv(fullPath, function(error) {
            if (error) {
                console.log('\x1b[31m%s\x1b[0m', 'Erro in UploadIconDesafio:', error);
                return { status: false , mensagem: Mensagens.PROBLEMA_ENVIO_IMAGEM };
            }
        });

        let statusFirebase = await obterDesafioStatusFirebase(desafioId);

        alterarDesafioIcon(desafioId, file.name);

        if (statusFirebase === 1)
            FBAlterarIconDesafio(estabelecimentoId, desafioId, file.name);

        return { status: true };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in UploadIconDesafio:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.UploadIconItemLoja = async (estabelecimentoId, itemLojaId, file) => {
    try
    {
        file.name = `${estabelecimentoId}_${itemLojaId}.png`;
        const path = `files/item_loja/icon/${file.name}`;
        const fullPath = `${__dirname}/../../../../public/${path}`;
        file.mv(fullPath, function(error) {
            if (error) {
                console.log('\x1b[31m%s\x1b[0m', 'Erro in UploadIconItemLoja:', error);
                return { status: false , mensagem: Mensagens.PROBLEMA_ENVIO_IMAGEM };
            }
        });

        let statusFirebase = await obterItemLojaStatusFirebase(itemLojaId);

        alterarItemLojaIcon(itemLojaId, file.name);

        if (statusFirebase === 1)
            FBAlterarIconItemLoja(estabelecimentoId, itemLojaId, file.name);

        return { status: true };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in UploadIconItemLoja:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.UploadIconProduto = async (estabelecimentoId, produtoId, file) => {
    try
    {
        file.name = `${estabelecimentoId}_${produtoId}.png`;
        const path = `files/produto/icon/${file.name}`;
        const fullPath = `${__dirname}/../../../../public/${path}`;
        file.mv(fullPath, function(error) {
            if (error) {
                console.log('\x1b[31m%s\x1b[0m', 'Erro in UploadIconProduto:', error);
                return { status: false , mensagem: Mensagens.PROBLEMA_ENVIO_IMAGEM };
            }
        });

        alterarProdutoIcon(produtoId, file.name);

        return { status: true };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in UploadIconProduto:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.UploadIconEstabelecimento = async (estabelecimentoId, file) => {
    try
    {
        file.name = `${estabelecimentoId}.png`;
        const path = `files/estabelecimento/icon/${file.name}`;
        const fullPath = `${__dirname}/../../../../public/${path}`;
        file.mv(fullPath, function(error) {
            if (error) {
                console.log('\x1b[31m%s\x1b[0m', 'Erro in UploadIconEstabelecimento:', error);
                return { status: false , mensagem: Mensagens.PROBLEMA_ENVIO_IMAGEM };
            }
        });

        alterarEstabelecimentoIcon(estabelecimentoId, file.name);
        //FBAlterarIconEstabelecimento(estabelecimentoId, file.name);

        return { status: true };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in UploadIconEstabelecimento:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};