exports.DownloadIconDesafio = async (estabelecimentoId, desafioId) => {
    try
    {
        console.log(estabelecimentoId, desafioId);

        return { status: true };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in DownloadIconDesafio:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};