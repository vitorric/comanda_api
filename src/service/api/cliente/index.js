const { cadastrarCliente,
        obterClienteParaCadastro,
        obterCliente,
        obterClienteCompleto,
        obterClienteEmail,
        obterClienteChaveUnicaPortal,
        alterarCliente,
        listarClientes,
        alterarClienteConfigApp,
        alterarConfigClienteAtual,
        alterarSenha,
        alterarGoldsEstabelecimento,
        listarClienteDesafios,
        listarClienteDesafiosConcluidos } = require('../../../repository/api/cliente'),
    {   cadastrarHistoricoCompra, listarHistoricoCompra  } = require('../../../repository/api/historicoCompraLojas'),
    {   obterItemLojaCliente, alterarItemLojaCompra  } = require('../../../repository/api/itemLoja'),
    { obterEstabelecimento, alterarClientesNoLocal } = require('../../../repository/api/estabelecimento'),
    { gerarChaveAmigavel, recuperarSenha } = require('../../../utils'),
    { FBCriarCliente,
        FBEntrarNoEstabelecimento,
        FBRecusarSairDoEstabelecimento,
        FBAlterarCliente,
        FBAlterarConfigApp } = require('../../../service/firebase/cliente'),
    { InserirMensagemNoCorreio } = require('../../../service/api/correio'),
    { CadastrarAvatar } = require('../avatar'),
    { criarToken } = require('../../passaport/criarToken');



function obterDinheiroNoEstabelecimento (goldPorEstabelecimento, estabelecimentoId) {
    return goldPorEstabelecimento.map(function(value) {
        if (value.estabelecimento == estabelecimentoId)
            return value.gold;
    });
}

function diminuirDinheiroNoEstabelecimento (goldPorEstabelecimento, estabelecimentoId, precoItem) {
    return goldPorEstabelecimento.map(function(value) {
        if (value.estabelecimento == estabelecimentoId)
            value.gold -= precoItem;
    });
}


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
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        let clienteEncontrado = await obterClienteParaCadastro(cliente.email, cliente.apelido);

        if (typeof clienteEncontrado !== 'undefined' && clienteEncontrado)
        {
            if (clienteEncontrado.email === cliente.email)
            {
                return { status: false , mensagem: Mensagens.CLIENTE_CADASTRAR_EMAIL };
            }

            if (clienteEncontrado.apelido === cliente.apelido)
            {
                return { status: false , mensagem: Mensagens.CLIENTE_CADASTRAR_APELIDO };
            }
        }

        let novoAvatar = await CadastrarAvatar((typeof cliente.avatar === 'object') ? cliente.avatar : JSON.parse(cliente.avatar));

        if (!novoAvatar){
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        cliente.avatar = novoAvatar._id;
        cliente.chaveAmigavel = gerarChaveAmigavel();

        cliente = await cadastrarCliente(cliente);

        return await obterCliente(cliente._id).then(async (result) => {
            return FBCriarCliente(result).then(() => {
                // Generate the token
                let token = criarToken({ _id: result._id });

                InserirMensagemNoCorreio({
                    cliente: cliente._id,
                    correio: {
                        titulo: 'Seja bem vindo!',
                        mensagem: 'Bem vindo a comanda gameficada!',
                        mensagemGrande: 'Olá, ' + cliente.nome + '! Agradecemos o seu cadastro em nosso app!'
                    }
                });

                return { status: !result ? false : true , objeto: { token, _id: cliente._id } };
            });
        });
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarCliente:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.LoginCliente = async (user) => {
    try
    {
        if (user == null)
        {
            return { status: false , mensagem: Mensagens.LOGIN_NAO_ENCONTRADO };
        }

        // Generate the token
        let token = criarToken({ _id: user });

        return { status: true , objeto: { token, _id: user } };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in LoginCliente:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ObterClienteChaveUnica = async chaveAmigavel => {

    try{

        let cliente = await obterClienteChaveUnicaPortal(chaveAmigavel.toUpperCase());

        if (!cliente){
            return { status: false, mensagem: Mensagens.CLIENTE_NAO_ENCONTRADO  };
        }

        return { status: true, objeto: cliente };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarCliente:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

//OK
exports.AlterarCliente = async (clienteId, { nome, cpf, dataNascimento } ) => {

    try{

        let cliente = {
            nome: nome,
            cpf: cpf,
            dataNascimento: dataNascimento
        };

        let clienteAlterado = await alterarCliente(clienteId, cliente);

        if (!clienteAlterado){
            return { status: false, mensagem: Mensagens.SOLICITACAO_INVALIDA  };
        }

        FBAlterarCliente(clienteId, cliente);
        return { status: true };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarCliente:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

//OK
exports.AlterarClienteConfigApp = async (clienteId, cliente) => {

    try
    {
        if (!clienteId ||
            !cliente.configApp)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };


        let configApp = (typeof cliente.configApp === 'object') ? cliente.configApp : JSON.parse(cliente.configApp);

        let configAlterada = await alterarClienteConfigApp(clienteId, configApp.somFundo, configApp.somGeral);

        if (!configAlterada)
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };

        FBAlterarConfigApp(clienteId, configApp);
        return { status: true };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarClienteConfigApp:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }

};

//OK
exports.EntrarNoEstabelecimento = async (clienteId, estabelecimentoId) => {

    try
    {
        let estabelecimento = await obterEstabelecimento(estabelecimentoId);

        if (!estabelecimento)
            return {status: false, mensagem: Mensagens.ESTABELECIMENTO_NAO_ENCONTRADO };

        if (estabelecimento.configEstabelecimentoAtual.estaAberta)
        {
            let cliente = await obterCliente(clienteId);

            if (cliente.configClienteAtual.estaEmUmEstabelecimento)
                return { status: false , mensagem: Mensagens.CLIENTE_JA_ESTA_NO_ESTABELECIMENTO_APP };

            cliente.configClienteAtual.estaEmUmEstabelecimento = true;
            cliente.configClienteAtual.estabelecimento = estabelecimento._id;
            cliente.configClienteAtual.nomeEstabelecimento = estabelecimento.nome;
            cliente.configClienteAtual.conviteEstabPendente = false;
            cliente.configClienteAtual.convitesComanda = [];

            let entrou = await alterarConfigClienteAtual(clienteId, cliente.configClienteAtual);

            if (entrou)
            {
                estabelecimento.configEstabelecimentoAtual.clientesNoLocal.push(clienteId);

                await alterarClientesNoLocal(estabelecimentoId, estabelecimento.configEstabelecimentoAtual.clientesNoLocal);

                return await FBEntrarNoEstabelecimento(clienteId, estabelecimentoId, estabelecimento.nome, cliente.configClienteAtual.comanda).then(() => {
                    return { status: true };
                });
            }
        }

        return {status: false, mensagem: Mensagens.ESTABELECIMENTO_FECHADO };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in EntrarNoEstabelecimento:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

//OK
exports.SairDoEstabelecimento = async clienteId => {

    try
    {
        let cliente = await obterCliente(clienteId);

        let estabelecimento = await obterEstabelecimento(cliente.configClienteAtual.estabelecimento);

        if (!cliente || !estabelecimento)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };


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
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

//OK
exports.RecuperarSenha = async (email) => {
    try
    {
        let cliente = await obterClienteEmail(email);

        if (cliente)
        {
            let senhas = await recuperarSenha();

            let alterado = await alterarSenha(cliente._id, senhas.novaSenhaBanco);

            if (alterado)
            {
                require('../../../service/email')(cliente.email, cliente.nome, senhas.novaSenha);
            }

            return { status: true , mensagem: Mensagens.SENHA_RECUPERADA };
        }

        return { status: false , mensagem: Mensagens.USUARIO_NAO_ENCONTRADO };
    }
    catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in RecuperarSenha:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.RecusarConviteEstabelecimento = async (clienteId) => {
    try
    {
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

        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in RecusarConviteEstabelecimento:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ComprarItemLoja = async (clienteId, infoCompra) => {

    try
    {
        if (!clienteId ||
        !infoCompra.estabelecimento ||
        !infoCompra.itemLoja ||
        !infoCompra.precoItem)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let cliente = await obterClienteCompleto(clienteId);
        //let estabelecimento = await obterEstabelecimento(infoCompra.estabelecimentoId);
        let itemLoja = await obterItemLojaCliente(infoCompra.itemLoja);

        if (!cliente ||
            !itemLoja)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        if (cliente.configClienteAtual.estabelecimento === null ||
            (cliente.configClienteAtual.estabelecimento.toString() !== infoCompra.estabelecimento.toString()))
            return { status: false , mensagem: Mensagens.CLIENTE_NAO_ESTA_NO_ESTABELECIMENTO_APP };
        if (itemLoja.quantidadeDisponivel <= 0)
            return { status: false , mensagem: Mensagens.ITEM_LOJA_SEM_ESTOQUE };
        if (obterDinheiroNoEstabelecimento(cliente.goldPorEstabelecimento, infoCompra.estabelecimento)[0] < infoCompra.precoItem)
            return { status: false , mensagem: Mensagens.DINHEIRO_INSUFICIENTE };
        if (new Date(itemLoja.tempoDisponivel) < new Date())
            return { status: false , mensagem: Mensagens.ITEM_LOJA_TEMPO_EXPIRADO };

        itemLoja.quantidadeDisponivel -= 1;
        itemLoja.quantidadeVendida += 1;

        let compraEfetuada = await alterarItemLojaCompra(itemLoja._id, itemLoja.quantidadeDisponivel, itemLoja.quantidadeVendida);

        if (!compraEfetuada)
        {
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        diminuirDinheiroNoEstabelecimento(cliente.goldPorEstabelecimento, infoCompra.estabelecimento, itemLoja.preco);

        await alterarGoldsEstabelecimento(clienteId, cliente.goldPorEstabelecimento);

        infoCompra.chaveUnica = gerarChaveAmigavel();

        await cadastrarHistoricoCompra(clienteId, infoCompra);

        return { status: true, objeto: infoCompra.chaveUnica };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in RecusarConviteEstabelecimento:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ListarHistoricoCompra = async (clienteId) => {

    try
    {
        let historico = await listarHistoricoCompra(clienteId);

        return { status: true, objeto: historico };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarHistoricoCompra:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ListarClientes = async () => {

    return await listarClientes().then((result) => {
        return { status: !result ? false : true, objeto: result };
    }).catch((error) => {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarClientes:', error);
        return { status: false , mensagem: Mensagens.ERRO_GENERITICO };
    });
};

exports.ListarClienteDesafios = async (obj) => {
    return await listarClienteDesafios(obj).then(result => {
        let resulObj = result;
        return { status: !result ? false : true, resulObj };
    }).catch(err => {
        console.log('registerUser errr:', err);
        return { status: false, msg: err };
    });
};


exports.ListarClienteDesafiosConcluidos = async clienteId => {

    try
    {
        let desafiosConcluidos = await listarClienteDesafiosConcluidos(clienteId);

        return { status: true, objeto: desafiosConcluidos };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarClienteDesafiosConcluidos:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};
