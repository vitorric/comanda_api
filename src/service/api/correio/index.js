const { cadastrarCorreio, obterCorreio, alterarCorreio, marcarMensagemComoLida, marcarAcaoExecutadaMensagem } = require('../../../repository/api/correio'),
    { FBInserirMensagemNoCorreio } = require('../../firebase/correio');

//servico generico que irá ser utilizado em várias rotas
//ter cuidado ao fazer alguma alteracao nele
exports.InserirMensagemNoCorreio = async (novaMensagem) =>
{
    try
    {
        if (!novaMensagem.cliente ||
            !novaMensagem.correio.titulo ||
            !novaMensagem.correio.mensagem)
            return false;

        novaMensagem.correio.dataCriacao = Date.now();

        let correioCliente = await obterCorreio(novaMensagem.cliente);

        if (!correioCliente)
        {
            return await cadastrarCorreio(novaMensagem).then((result) => {
                FBInserirMensagemNoCorreio(result);
                return true;
            }).catch(error => {
                console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarCorreio:', error);
                return false;
            });
        }

        if (correioCliente)
        {
            let mensagem =
            {
                titulo: novaMensagem.correio.titulo,
                mensagem: novaMensagem.correio.mensagem,
                mensagemGrande: novaMensagem.correio.mensagemGrande,
                dataCriacao: novaMensagem.correio.dataCriacao,
                status: true
            };

            if (typeof novaMensagem.correio.acao !== 'undefined')
                mensagem.acao = novaMensagem.correio.acao;

            correioCliente.correio.push(mensagem);

            alterarCorreio(correioCliente);
            FBInserirMensagemNoCorreio(correioCliente);
        }
    }
    catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in InserirMensagemNoCorreio:', error);
    }
};

exports.MarcarMensagemComoLida = async (clienteId, mensagemId) =>
{
    try
    {
        await marcarMensagemComoLida(clienteId, mensagemId);
        let correioAlterado = await obterCorreio(clienteId);
        FBInserirMensagemNoCorreio(correioAlterado);
        return { status: true };
    }
    catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in MarcarMensagemComoLida:', error);
    }
};

exports.DesativarMensagemConviteGrupo = async (clienteId, comandaId) =>
{
    try
    {
        let correioCliente = await obterCorreio(clienteId);

        correioCliente.correio.map(function(value)
        {
            if (typeof value.acao.comanda !== 'undefined' && value.acao.comanda.toString() === comandaId.toString())
            {
                value.status = false;
            }
        });

        alterarCorreio(correioCliente);
        FBInserirMensagemNoCorreio(correioCliente);

        return { status: true };
    }
    catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in DesativarMensagemConviteGrupo:', error);
    }
};

exports.MarcarAcaoExecutadaMensagem = async (clienteId, comandaId) =>
{
    try
    {
        await marcarAcaoExecutadaMensagem(clienteId, comandaId);
        let correioAlterado = await obterCorreio(clienteId);
        FBInserirMensagemNoCorreio(correioAlterado);

        return { status: true };
    }
    catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in MarcarAcaoExecutadaMensagem:', error);
    }
};