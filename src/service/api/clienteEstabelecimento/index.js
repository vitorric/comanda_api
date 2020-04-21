const {
    cadastrarClienteEstabelecimento,
    listarClientesEstabelecimento,
    obterClienteEstabelecimento,
    alterarClienteEstabelecimento
} = require('../../../repository/api/clienteEstabelecimento');

exports.CadastrarClienteEstabelecimento = async (estabelecimentoId, clienteEstabelecimento) => {

    try
    {
        clienteEstabelecimento.estabelecimento = estabelecimentoId;

        let clienteEstabelecimentoCadastrado = await cadastrarClienteEstabelecimento(clienteEstabelecimento);

        if (clienteEstabelecimento)
            return { status: true, objeto: clienteEstabelecimentoCadastrado };

        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarClienteEstabelecimento:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }

};

exports.ObterClienteEstabelecimento = async clienteId => {
    try
    {
        let produto = await obterClienteEstabelecimento(clienteId);

        return { status: true, objeto: produto };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterClienteEstabelecimento:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.AlterarClienteEstabelecimento = async cliente => {
    try
    {
        let clienteAlterado = await alterarClienteEstabelecimento(cliente._id, cliente);

        if (!clienteAlterado)
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };

        return { status: true };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarClienteEstabelecimento:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ListarClientesEstabelecimento = async (estabelecimentoId, nome) => {

    let nomeCliente = (!nome) ? '' : nome;

    try
    {
        let clientes = await listarClientesEstabelecimento(estabelecimentoId, nomeCliente);

        return { status: true, objeto: clientes };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarClientesEstabelecimento:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};