const { cadastrarEstabelecimento,
        obterEstabelecimentoEmail,
        obterParaClientes,
        obterEstabelecimento,
        alterarStatusEstabOnline,
        listarParaClientes } = require('../../../repository/api/estabelecimento'),
    { obterCliente, alterarConfigClienteAtual } = require('../../../repository/api/cliente'),
    { obterHistoricoCompra, alterarStatusEntregaItem } = require('../../../repository/api/historicoCompraLojas'),
    { cadastrarRole } = require('../../../repository/api/role'),
    { criarToken } = require('../../passaport/criarToken'),
    { FBAdicionarClienteAoEstabelecimento } = require('../../firebase/estabelecimento');



exports.LoginEstabelecimento = async user => {
    try
    {
        if (user == null)
        {
            return {status: false, mensagem: Mensagens.LOGIN_NAO_ENCONTRADO};
        }

        // Generate the token
        let token = criarToken( user );

        return {
            status: true,
            objeto: {
                token,
                estabelecimento: {
                    status: user.status,
                    email: user.email,
                    nome: user.nome
                }
            }
        };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in LoginEstabelecimento:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.CadastrarEstabelecimento = async estabelecimento => {

    try
    {
        if (!estabelecimento.email ||
            !estabelecimento.password ||
            !estabelecimento.tipo ||
            !estabelecimento.nome ||
            !estabelecimento.cnpj ||
            !estabelecimento.horarioAtendimentoInicio ||
            !estabelecimento.horarioAtendimentoFim ||
            !estabelecimento.endereco.rua ||
            !estabelecimento.endereco.numero ||
            !estabelecimento.endereco.bairro ||
            !estabelecimento.endereco.cidade ||
            !estabelecimento.endereco.cep ||
            !estabelecimento.endereco.estado)
        {
            return { status: false , mensagem: Mensagens.ESTABELECIMENTO_CADASTRAR_ERRO };
        }

        let estabelecimentoCheck = await obterEstabelecimentoEmail(estabelecimento.email, estabelecimento.cnpj);

        if (estabelecimentoCheck)
        {
            if (estabelecimentoCheck.email === estabelecimento.email)
            {
                return { status: false , mensagem: Mensagens.ESTABELECIMENTO_CADASTRAR_EMAIL };
            }

            if (estabelecimentoCheck.cnpj === estabelecimento.cnpj)
            {
                return { status: false , mensagem: Mensagens.ESTABELECIMENTO_CADASTRAR_CNPJ };
            }
        }

        let novaRole = await cadastrarRole('Administrador');

        if (novaRole)
        {
            estabelecimento.roles = [];
            estabelecimento.roles.push(novaRole);

            let novoEstabelecimento = await cadastrarEstabelecimento(estabelecimento);

            if (novoEstabelecimento)
            {
                return {status: true, objeto: novoEstabelecimento};
            }

            return { status: false , mensagem: Mensagens.ESTABELECIMENTO_CADASTRAR_ERRO };
        }

        return { status: false , mensagem: Mensagens.ESTABELECIMENTO_CADASTRAR_ERRO };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarEstabelecimento:', error);
        return { status: false , mensagem: Mensagens.ESTABELECIMENTO_CADASTRAR_ERRO };
    }
};

exports.ObterParaClientes = async estabelecimentoId => {
    try
    {
        if (!estabelecimentoId)
        {
            return {status: false, mensagem: Mensagens.ESTABELECIMENTO_NAO_ENCONTRADO};
        }

        let estabelecimento = await obterParaClientes(estabelecimentoId);
        return { status: true, objeto: estabelecimento };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterParaClientes:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ObterEstabelecimento = async estabelecimentoId => {
    try
    {
        if (!estabelecimentoId)
        {
            return {status: false, mensagem: Mensagens.ESTABELECIMENTO_NAO_ENCONTRADO};
        }

        let estabelecimento = await obterEstabelecimento(estabelecimentoId);
        return { status: true, objeto: estabelecimento };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterEstabelecimento:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ListarParaClientes = async nome => {

    try
    {
        let estabelecimentos = await listarParaClientes((!nome) ? '' : nome);
        return { status: true, objeto: estabelecimentos };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarParaClientes:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.AdicionarClienteAoEstabelecimento = async (estabelecimentoId, clienteId) => {

    try
    {
        const estabelecimento = await obterEstabelecimento(estabelecimentoId);
        const cliente = await obterCliente(clienteId);
        console.log(estabelecimentoId, clienteId);
        if (cliente.configClienteAtual.estaEmUmEstabelecimento)
            return {status: false, mensagem: Mensagens.CLIENTE_JA_ESTA_NO_ESTABELECIMENTO};

        if (cliente.configClienteAtual.conviteEstabPendente)
            return {status: false, mensagem: Mensagens.CLIENTE_JA_TEM_CONVITE};

        cliente.configClienteAtual.conviteEstabPendente = true;
        cliente.configClienteAtual.estabelecimento = estabelecimento._id;
        cliente.configClienteAtual.nomeEstabelecimento = estabelecimento.nome;

        if (estabelecimento.configEstabelecimentoAtual.estaAberta)
        {

            let entrou = await alterarConfigClienteAtual(clienteId, cliente.configClienteAtual);

            if (entrou)
            {
                estabelecimento.configEstabelecimentoAtual.clientesNoLocal.push(clienteId);

                return await FBAdicionarClienteAoEstabelecimento(clienteId, estabelecimentoId, estabelecimento.nome).then(() => {
                    return { status: true };
                });
            }
        }

        return {status: false, mensagem: Mensagens.ESTABELECIMENTO_FECHADO};
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AdicionarClienteAoEstabelecimento:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.AlterarStatusEstabOnline = async (estabelecimentoId, status) => {

    try
    {
        let alterado = await alterarStatusEstabOnline(estabelecimentoId, status);

        if (alterado)
        {
            return {status: true};
        }

        return { status: false, mensagem: Mensagens.SOLICITACAO_INVALIDA};
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarStatusEstabOnline:', error);
        return {status: false};
    }
};

exports.AlterarStatusEntregaItem = async (estabelecimentoId, clienteId, chaveUnica, status) => {

    try
    {
        let historico = await obterHistoricoCompra(estabelecimentoId, clienteId, chaveUnica);

        if (!historico)
        {
            return { status: false, mensagem: Mensagens.DADOS_INVALIDOS};
        }

        let alterado = await alterarStatusEntregaItem(estabelecimentoId, clienteId, status, new Date());

        if (alterado)
        {
            return {status: true};
        }

        return { status: false, mensagem: Mensagens.SOLICITACAO_INVALIDA};
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarStatusEntregaItem:', error);
        return {status: false};
    }
};