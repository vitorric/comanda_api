const { cadastrarCliente,
        obterClienteParaCadastro,
        obterCliente,
        obterClienteEmail,
        alterarCliente,
        listarClientes,
        alterarClienteConfigApp,
        alterarConfigClienteAtual,
        alterarSenha,
        listarClienteConquistas } = require('../../../repository/api/cliente'),
    {   comprarItemLoja,
        listarHistoricoCompra } = require('../../../repository/api/historicoCompraLojas'),
    { obterEstabelecimento, alterarClientesNoLocal } = require('../../../repository/api/estabelecimento'),
    { gerarChaveAmigavel, recuperarSenha } = require('../../../utils'),
    { FBCriarCliente, FBEntrarNoEstabelecimento, FBRecusarSairDoEstabelecimento } = require('../../../service/firebase/cliente'),
    { CadastrarAvatar } = require('../avatar'),
    { criarToken } = require('../../passaport/criarToken');

//OK
exports.CadastrarCliente = async ({ email, password, nome, apelido, sexo, avatar }) => {
    try
    {
        let cliente = {
            email: email,
            password: password,
            nome: nome,
            apelido: apelido,
            sexo: sexo,
            avatar: avatar
        };

        if (!cliente.email ||
           !cliente.password ||
           !cliente.nome ||
           !cliente.apelido ||
           !cliente.sexo ||
           !cliente.avatar)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.CLIENTE_CADASTRAR_ERRO };
        }

        let clienteEncontrado = await obterClienteParaCadastro(cliente.email, cliente.apelido);

        if (typeof clienteEncontrado !== 'undefined' && clienteEncontrado)
        {
            if (clienteEncontrado.email === cliente.email)
            {
                // eslint-disable-next-line no-undef
                return { status: false , mensagem: Mensagens.CLIENTE_CADASTRAR_EMAIL };
            }

            if (clienteEncontrado.apelido === cliente.apelido)
            {
                // eslint-disable-next-line no-undef
                return { status: false , mensagem: Mensagens.CLIENTE_CADASTRAR_APELIDO };
            }
        }

        let novoAvatar = await CadastrarAvatar((typeof cliente.avatar === 'object') ? cliente.avatar : JSON.parse(cliente.avatar));

        if (!novoAvatar){
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.AVATAR_CADASTRAR_ERRO };
        }

        cliente.avatar = novoAvatar._id;
        cliente.chaveAmigavel = gerarChaveAmigavel();

        cliente = await cadastrarCliente(cliente);

        return await obterCliente(cliente._id).then(async (result) => {
            return FBCriarCliente(result).then(() => {
                // Generate the token
                let token = criarToken({ _id: result._id });

                return { status: !result ? false : true , objeto: { token, _id: cliente._id } };
            });

        });
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarCliente:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.CLIENTE_CADASTRAR_ERRO };
    }
};

exports.LoginCliente = async (user) => {
    try
    {
        if (user == null)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.LOGIN_NAO_ENCONTRADO };
        }

        // Generate the token
        let token = criarToken({ _id: user });

        return { status: true , objeto: { token, _id: user } };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in LoginCliente:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.LOGIN_NAO_ENCONTRADO };
    }
};

//OK
exports.AlterarCliente = async (clienteId, { status, nome, cpf, dataNascimento, pontos, goldGeral } ) => {

    let cliente = {
        status: status,
        nome: nome,
        cpf: cpf,
        dataNascimento: dataNascimento,
        pontos: pontos,
        goldGeral: goldGeral
    };

    return await alterarCliente(clienteId, cliente).then((result) => {
        return { status: !result ? false : true };
    }).catch((error) => {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarCliente:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.CLIENTE_ALTERAR_ERRO };
    });

};

//OK
exports.AlterarClienteConfigApp = async (clienteId, cliente) => {

    if (!clienteId ||
        !cliente.configApp)
    {
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.CLIENTE_ALTERAR_CONFIG_ERRO };
    }

    let configApp = (typeof cliente.configApp === 'object') ? cliente.configApp : JSON.parse(cliente.configApp);

    if (!configApp.somFundo ||
        !configApp.somGeral)
    {
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.CLIENTE_ALTERAR_CONFIG_ERRO };
    }

    return await alterarClienteConfigApp(clienteId, configApp.somFundo, configApp.somGeral).then((result) => {
        return { status: !result ? false : true };
    }).catch((error) =>{
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarClienteConfigApp:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.CLIENTE_ALTERAR_CONFIG_ERRO };
    });
};

//OK
exports.EntrarNoEstabelecimento = async (clienteId, estabelecimentoId) => {

    try
    {

        let estabelecimento = await obterEstabelecimento(estabelecimentoId);

        if (estabelecimento.configEstabelecimentoAtual.estaAberta)
        {
            const cliente = await obterCliente(clienteId);

            if (cliente.configClienteAtual.estaEmUmEstabelecimento)
                // eslint-disable-next-line no-undef
                return { status: false , mensagem: Mensagens.CLIENTE_JA_ESTA_NO_ESTABELECIMENTO_APP };

            cliente.configClienteAtual.estaEmUmEstabelecimento = true;
            cliente.configClienteAtual.estabelecimento = estabelecimento._id;
            cliente.configClienteAtual.nomeEstabelecimento = estabelecimento.nome;
            cliente.configClienteAtual.conviteEstabPendente = false;

            let entrou = await alterarConfigClienteAtual(clienteId, cliente.configClienteAtual);

            if (entrou)
            {
                estabelecimento.configEstabelecimentoAtual.clientesNoLocal.push(clienteId);

                await alterarClientesNoLocal(estabelecimentoId, estabelecimento.configEstabelecimentoAtual.clientesNoLocal);

                return await FBEntrarNoEstabelecimento(clienteId, estabelecimentoId, estabelecimento.nome).then(() => {
                    return { status: true };
                });
            }
        }

        // eslint-disable-next-line no-undef
        return {status: false, mensagem: Mensagens.ESTABELECIMENTO_FECHADO };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in EntrarNoEstabelecimento:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.CLIENTE_ERRO_ENTRAR_ESTABELECIMENTO };
    }
};

//OK
exports.SairDoEstabelecimento = async (clienteId,) => {

    try
    {
        let cliente = await obterCliente(clienteId);

        let estabelecimento = await obterEstabelecimento(cliente.configClienteAtual.estabelecimento);

        if (!cliente || !estabelecimento)
        // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.CLIENTE_JA_ESTA_NO_ESTABELECIMENTO_APP };


        cliente.configClienteAtual.estaEmUmEstabelecimento = false;
        cliente.configClienteAtual.estabelecimento = null;
        cliente.configClienteAtual.nomeEstabelecimento = null;

        let saiu = await alterarConfigClienteAtual(clienteId, cliente.configClienteAtual);

        if (saiu)
        {
            let index = estabelecimento.configEstabelecimentoAtual.clientesNoLocal.indexOf(cliente._id);
            estabelecimento.configEstabelecimentoAtual.clientesNoLocal.splice(index,1);

            await alterarClientesNoLocal(estabelecimento._id, estabelecimento.configEstabelecimentoAtual.clientesNoLocal);

            return await FBRecusarSairDoEstabelecimento(clienteId).then(() => {
                return { status: true };
            });
        }}
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in SairDoEstabelecimento:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.CLIENTE_ERRO_SAIR_ESTABELECIMENTO };
    }
};

//OK
exports.RecuperarSenha = async (email) => {
    try {
        let cliente = await obterClienteEmail(email);

        if (cliente)
        {
            let senhas = await recuperarSenha();

            let alterado = await alterarSenha(cliente._id, senhas.novaSenhaBanco);

            if (alterado)
            {
                require('../../../service/email')(cliente.email, cliente.nome, senhas.novaSenha);
            }

            // eslint-disable-next-line no-undef
            return { status: true , mensagem: Mensagens.SENHA_RECUPERADA };
        }

        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.USUARIO_NAO_ENCONTRADO };
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in RecuperarSenha:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.USUARIO_NAO_ENCONTRADO };
    }
};

exports.RecusarConviteEstabelecimento = async (clienteId) => {

    let cliente = await obterCliente(clienteId);

    cliente.configClienteAtual.estaEmUmEstabelecimento = false;
    cliente.configClienteAtual.estabelecimento = null;
    cliente.configClienteAtual.nomeEstabelecimento = null;
    cliente.configClienteAtual.conviteEstabPendente = false;

    let saiu = await alterarConfigClienteAtual(clienteId, cliente.configClienteAtual);

    if (saiu)
    {
        return await FBRecusarSairDoEstabelecimento(clienteId).then(() => {
            return { status: true };
        });
    }
};

exports.ListarClientes = async () => {

    return await listarClientes().then((result) => {
        return { status: !result ? false : true, objeto: result };
    }).catch((error) => {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarClientes:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.ERRO_GENERITICO };
    });
};


exports.ComprarItemLoja = async (obj) => {
    return await comprarItemLoja(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        return { status: false, msg: err === 0 ? 'REGISTRATION_ERROR_EMAIL' : 'REGISTRATION_ERROR_USER' };
    });
};

exports.ListarClienteConquistas = async (obj) => {
    return await listarClienteConquistas(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        console.log('registerUser errr:', err);
        return { status: false, msg: err };
    });
};

exports.ListarHistoricoCompra = async (obj) => {
    return await listarHistoricoCompra(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        console.log('registerUser errr:', err);
        return { status: false, msg: err };
    });
};