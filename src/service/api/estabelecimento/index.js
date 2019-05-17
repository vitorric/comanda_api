const { cadastrarEstabelecimento,
        obterEstabelecimentoViaToken,
        obterParaAdmin,
        obterEstabelecimentoEmail,
        obterParaClientes,
        obterEstabelecimento,
        alterarStatusEntregaItem,
        alterarStatusEstabOnline,
        inserirItemNaLojaDoEstabelecimento,
        listarParaAdmin,
        listarParaClientes } = require('../../../repository/api/estabelecimento'),
    { obterCliente, alterarConfigClienteAtual, removerTodosOsClientesDeUmEstabelecimento } = require('../../../repository/api/cliente'),
    { cadastrarRole } = require('../../../repository/api/role'),
    { criarToken } = require('../../passaport/criarToken'),
    { FBAdicionarClienteAoEstabelecimento } = require('../../firebase/estabelecimento');

//ok
exports.CadastrarEstabelecimento = async (estabelecimento) => {

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
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.ESTABELECIMENTO_CADASTRAR_ERRO };
        }

        let estabelecimentoCheck = await obterEstabelecimentoEmail(estabelecimento.email, estabelecimento.cnpj);

        if (estabelecimentoCheck)
        {
            if (estabelecimentoCheck.email === estabelecimento.email)
            {
                // eslint-disable-next-line no-undef
                return { status: false , mensagem: Mensagens.ESTABELECIMENTO_CADASTRAR_EMAIL };
            }

            if (estabelecimentoCheck.cnpj === estabelecimento.cnpj)
            {
                // eslint-disable-next-line no-undef
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

            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.ESTABELECIMENTO_CADASTRAR_ERRO };
        }

        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.ESTABELECIMENTO_CADASTRAR_ERRO };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarEstabelecimento:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.ESTABELECIMENTO_CADASTRAR_ERRO };
    }
};

//ok
exports.ObterParaClientes = async estabelecimentoId => {
    try
    {
        if (!estabelecimentoId)
        {
            // eslint-disable-next-line no-undef
            return {status: false, mensagem: Mensagens.ESTABELECIMENTO_NAO_ENCONTRADO};
        }

        let estabelecimento = await obterParaClientes(estabelecimentoId);
        return { status: true, objeto: estabelecimento };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterParaClientes:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

//ok
exports.ListarParaClientes = async (nome) => {
    try
    {
        let estabelecimentos = await listarParaClientes(nome);
        return { status: true, objeto: estabelecimentos };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarParaClientes:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

//ok
exports.LoginEstabelecimento = async (user) => {
    try
    {
        if (user == null)
        {
        // eslint-disable-next-line no-undef
            return {status: false, mensagem: Mensagens.LOGIN_NAO_ENCONTRADO};
        }

        // Generate the token
        let token = criarToken( user );

        return {
            status: false,
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
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

//ok
exports.AdicionarClienteAoEstabelecimento = async (estabelecimentoId, clienteId) => {

    try
    {
        const estabelecimento = await obterEstabelecimento(estabelecimentoId);
        const cliente = await obterCliente(clienteId);
        console.log(estabelecimentoId, clienteId);
        if (cliente.configClienteAtual.estaEmUmEstabelecimento)
            // eslint-disable-next-line no-undef
            return {status: false, mensagem: Mensagens.CLIENTE_JA_ESTA_NO_ESTABELECIMENTO};

        if (cliente.configClienteAtual.conviteEstabPendente)
            // eslint-disable-next-line no-undef
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

        // eslint-disable-next-line no-undef
        return {status: false, mensagem: Mensagens.ESTABELECIMENTO_FECHADO};
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AdicionarClienteAoEstabelecimento:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

//ok
exports.AlterarStatusEstabOnline = async (estabelecimentoId, status) => {

    try
    {
        let estabelecimento = await obterEstabelecimento(estabelecimentoId);

        if (!status)
        {
            await removerTodosOsClientesDeUmEstabelecimento(estabelecimento.configEstabelecimentoAtual.clientesNoLocal);

            estabelecimento.configEstabelecimentoAtual.clientesNoLocal = [];
        }

        let alterado = await alterarStatusEstabOnline(estabelecimentoId, status, estabelecimento.configEstabelecimentoAtual.clientesNoLocal);

        if (alterado)
        {
            return {status: true};
        }

        return {status: false};
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarStatusEstabOnline:', error);
        return {status: false};
    }
};

exports.AlterarStatusEntregaItem = async (obj) => {
    return await alterarStatusEntregaItem(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        return { status: false, msg: err === 0 ? 'REGISTRATION_ERROR_EMAIL' : 'REGISTRATION_ERROR_USER' };
    });
};

exports.InserirItemNaLojaDoEstabelecimento = async (obj) => {
    return await inserirItemNaLojaDoEstabelecimento(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        return { status: false, msg: err === 0 ? 'REGISTRATION_ERROR_EMAIL' : 'REGISTRATION_ERROR_USER' };
    });
};

exports.ListarParaAdmin = async (obj) => {
    return await listarParaAdmin(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        console.log('registerUser errr:', err);
        return { status: false, msg: !err ? 'REGISTRATION_ERROR_EMAIL' : 'REGISTRATION_ERROR_USER' };
    });
};


exports.ObterEstabelecimentoViaToken = async (obj) => {
    return await obterEstabelecimentoViaToken(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        console.log('registerUser errr:', err);
        return { status: false, msg: !err };
    });
};

exports.ObterParaAdmin = async (obj) => {
    return await obterParaAdmin(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        console.log('registerUser errr:', err);
        return { status: false, msg: !err ? 'REGISTRATION_ERROR_EMAIL' : 'REGISTRATION_ERROR_USER' };
    });
};