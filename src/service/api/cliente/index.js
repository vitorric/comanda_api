const { cadastrarCliente,
        obterClienteParaCadastro,
        obterCliente,
        obterClienteCompleto,
        obterClienteEmail,
        obterClienteApelido,
        obterClienteCPF,
        obterClienteSocialId,
        obterClienteChaveUnicaPortal,
        alterarCliente,
        listarClientes,
        alterarClienteConfigApp,
        alterarConfigClienteAtual,
        alterarSenha,
        alterarGoldsEstabelecimento,
        listarClienteDesafios,
        listarGoldEstabelecimento,
        obterUltimaChaveAmigavel,
        registrarTokenFirebase,
        deletarTokenFirebase } = require('../../../repository/api/cliente'),
    { listarDesafioClienteConcluido, obterDesafioClienteConcluido } = require('../../../repository/api/desafioCliente'),
    { cadastrarHistoricoCompra, listarHistoricoCompra } = require('../../../repository/api/historicoCompraLojas'),
    { obterItemLojaCliente, alterarItemLojaCompra } = require('../../../repository/api/itemLoja'),
    { obterEstabelecimento, alterarClientesNoLocal } = require('../../../repository/api/estabelecimento'),
    { obterToken, cadastrarToken, excluirToken } = require('../../../repository/api/token'),
    { gerarChaveAmigavel, criptografarSenha } = require('../../../utils'),
    { FBCriarCliente,
        FBEntrarNoEstabelecimento,
        FBRecusarSairDoEstabelecimento,
        FBAlterarCliente,
        FBAlterarConfigApp,
        FBAlterarGoldEstabelecimento } = require('../../../service/firebase/cliente'),
    { FBAlterarEstoqueItem } = require('../../firebase/estabelecimento'),
    { InserirMensagemNoCorreio } = require('../../../service/api/correio'),
    { CadastrarAvatar } = require('../avatar'),
    { criarToken } = require('../../passaport/criarToken'),
    { CalcularDistanciaLatLong } = require('../../../utils/GPS'),
    { EnviarEmailRecuperarSenha } = require('../../../service/email');



function obterDinheiroNoEstabelecimento (goldPorEstabelecimento, estabelecimentoId) {
    return goldPorEstabelecimento.map(function(value) {
        if (value.estabelecimento == estabelecimentoId)
            return value.gold;
    });
}

//OK
exports.CadastrarCliente = async ({ email, password, nome, apelido, sexo, avatar, deviceId, tokenFirebase, dataNascimento, cpf, tipoLogin, socialId }) => {
    try
    {
        let cliente = {
            email: email,
            nome: nome,
            apelido: apelido,
            sexo: sexo,
            avatar: avatar,
            dataNascimento: dataNascimento,
            cpf: cpf,
            tipoLogin: tipoLogin
        };

        if (tipoLogin === 'normal')
            cliente.password = password;

        if (tipoLogin !== 'normal')
            cliente.socialId = socialId;

        if (!cliente.nome ||
           !cliente.apelido ||
           !cliente.sexo ||
           !cliente.avatar ||
           !cliente.dataNascimento ||
           !cliente.cpf)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        if (tipoLogin === 'normal' && (!cliente.email || !cliente.password))
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

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

        let ultimaChaveAmigavel = await obterUltimaChaveAmigavel();

        cliente.chaveAmigavel = (typeof ultimaChaveAmigavel === 'undefined') ? 1000 : parseInt(ultimaChaveAmigavel.chaveAmigavel) + 1;

        let novoCliente = await cadastrarCliente(cliente);

        return await obterCliente(novoCliente._id).then(async (result) => {
            return FBCriarCliente(result).then(() => {

                deletarTokenFirebase(novoCliente._id, deviceId);

                if (tokenFirebase)
                {
                    registrarTokenFirebase(novoCliente._id, deviceId, tokenFirebase);
                }

                // Generate the token
                let token = criarToken({ _id: result._id });

                InserirMensagemNoCorreio({
                    cliente: novoCliente._id,
                    correio: {
                        titulo: 'Seja bem vindo!',
                        mensagem: 'Bem vindo a comanda gameficada!',
                        mensagemGrande: 'Olá, ' + novoCliente.nome + '! Agradecemos o seu cadastro em nosso app!'
                    }
                });

                return { status: !result ? false : true , objeto: { token, _id: novoCliente._id } };
            });
        });
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarCliente:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.LoginCliente = async (user, { deviceId, tokenFirebase }) => {
    try
    {
        console.log(deviceId, tokenFirebase);

        if (user == null)
        {
            return { status: false , mensagem: Mensagens.LOGIN_NAO_ENCONTRADO };
        }

        await deletarTokenFirebase(user, deviceId);

        if (tokenFirebase)
        {
            registrarTokenFirebase(user, deviceId, tokenFirebase);
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

exports.LoginClienteFacebook = async ({ deviceId, tokenFirebase, socialId }) => {
    try
    {
        let user = await obterClienteSocialId(socialId);

        if (user == null)
        {
            return { status: true };
        }

        await deletarTokenFirebase(user._id, deviceId);

        if (tokenFirebase)
        {
            registrarTokenFirebase(user._id, deviceId, tokenFirebase);
        }

        // Generate the token
        let token = criarToken({ _id: user._id });

        return { status: true , objeto: { token, _id: user._id } };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in LoginClienteFacebook:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.DeslogarCliente = async (deviceId, clienteId) => {
    try
    {
        console.log('DeslogarCliente: ', clienteId, deviceId);
        await deletarTokenFirebase(clienteId, deviceId);

        return { status: true };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in DeslogarCliente:', error);
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

exports.ObterClienteEmail = async email => {

    try{

        let cliente = await obterClienteEmail(email);

        if (!cliente)
            return { status: true };

        return { status: false, mensagem: Mensagens.CLIENTE_CADASTRAR_EMAIL };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarCliente:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ObterClienteApelido = async apelido => {

    try{

        let cliente = await obterClienteApelido(apelido);

        if (!cliente || cliente.length === 0)
            return { status: true };

        return { status: false, mensagem: Mensagens.CLIENTE_CADASTRAR_APELIDO };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarCliente:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ObterClienteCPF = async cpf => {

    try{

        let cliente = await obterClienteCPF(cpf);

        if (!cliente)
            return { status: true };

        return { status: false, mensagem: Mensagens.CLIENTE_CADASTRAR_CPF };
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
exports.EntrarNoEstabelecimento = async (clienteId, estabelecimentoId, coordenadas) => {

    try
    {
        let estabelecimento = await obterEstabelecimento(estabelecimentoId);

        if (!estabelecimento)
            return {status: false, mensagem: Mensagens.ESTABELECIMENTO_NAO_ENCONTRADO };

        if (CalcularDistanciaLatLong(estabelecimento.coordenadas.lat, estabelecimento.coordenadas.long, coordenadas.lat, coordenadas.long, 'K'))
        {
            console.log(CalcularDistanciaLatLong(estabelecimento.coordenadas.lat, estabelecimento.coordenadas.long, coordenadas.lat, coordenadas.long, 'K'));
            return {status: false, mensagem: Mensagens.CLIENTE_LONGE_ESTABELECIMENTO };
        }

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

exports.SolicitarRecuperarSenha = async email => {
    try
    {
        let cliente = await obterClienteEmail(email);

        if (cliente)
        {
            let token = criarToken({ _id: cliente._id });

            cadastrarToken({
                cliente: cliente._id,
                nome: cliente.nome,
                email: cliente.email,
                token: token,
                tipo: 'RecuperarSenha'
            });

            EnviarEmailRecuperarSenha(cliente.email, cliente.nome, token);

            return { status: true , mensagem: Mensagens.SOLICITACAO_SENHA_RECUPERADA };
        }

        return { status: false , mensagem: Mensagens.USUARIO_NAO_ENCONTRADO };
    }
    catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in SolicitarRecuperarSenha:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

//OK
exports.RecuperarSenha = async ({email, novaSenha, token}) => {
    try
    {
        let tokenValido = await obterToken(email, token);

        if (tokenValido)
        {

            let cripto = await criptografarSenha(novaSenha);

            alterarSenha(tokenValido.cliente, cripto.novaSenhaBanco);
            excluirToken(email, token, tokenValido.cliente);

            return { status: false , mensagem: Mensagens.SENHA_RECUPERADA };
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
        console.log(infoCompra);
        if (!clienteId ||
        !infoCompra.estabelecimento ||
        !infoCompra.itemLoja)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let cliente = await obterClienteCompleto(clienteId);
        //let estabelecimento = await obterEstabelecimento(infoCompra.estabelecimentoId);
        let itemLoja = await obterItemLojaCliente(infoCompra.itemLoja);

        if (!cliente ||
            !itemLoja)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let estabelecimentoId = cliente.configClienteAtual.estabelecimento;

        if (estabelecimentoId === null ||
            (estabelecimentoId.toString() !== infoCompra.estabelecimento.toString()))
            return { status: false , mensagem: Mensagens.CLIENTE_NAO_ESTA_NO_ESTABELECIMENTO_APP };
        if (itemLoja.quantidadeDisponivel <= 0)
            return { status: false , mensagem: Mensagens.ITEM_LOJA_SEM_ESTOQUE };
        if (obterDinheiroNoEstabelecimento(cliente.goldPorEstabelecimento, infoCompra.estabelecimento)[0] < itemLoja.preco)
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

        FBAlterarEstoqueItem(estabelecimentoId, itemLoja);

        await alterarGoldsEstabelecimento(clienteId, estabelecimentoId, (parseInt(itemLoja.preco) * -1));

        let listaGolds = await listarGoldEstabelecimento(clienteId);
        FBAlterarGoldEstabelecimento(clienteId, listaGolds);

        let chaveUnica = gerarChaveAmigavel();

        let infoCompraHist = {
            cliente: cliente._id,
            estabelecimento: estabelecimentoId,
            itemLoja: infoCompra.itemLoja,
            quantidade: 1,
            modoObtido: 'Compra',
            chaveUnica: chaveUnica,
            precoItem: itemLoja.preco
        };

        cadastrarHistoricoCompra(clienteId, infoCompraHist);

        let estabelecimento = await obterEstabelecimento(estabelecimentoId);

        //insere mensagem no correio
        InserirMensagemNoCorreio({
            cliente: cliente._id,
            correio: {
                titulo: 'Resgate sua compra!',
                mensagem: 'Apresente o cupom de resgate <color=yellow>' + chaveUnica + '</color> para o estabelecimento ' + estabelecimento.nome,
                mensagemGrande: 'Apresente o cupom de resgate <color=yellow>' + chaveUnica + '</color> para o estabelecimento ' + estabelecimento.nome + '. O cupom é valido somente 1x.'
            }
        });

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

exports.ListarClienteDesafiosConcluidos = async clienteId => {

    try
    {
        let desafiosConcluidos = await listarDesafioClienteConcluido(clienteId);

        return { status: true, objeto: {desafios: desafiosConcluidos} };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarClienteDesafiosConcluidos:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ObterClienteDesafioConcluido = async (clienteId, desafioId) => {

    try
    {
        let desafiosConcluidos = await obterDesafioClienteConcluido(clienteId, desafioId);

        return { status: true, objeto: desafiosConcluidos};
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterClienteDesafioConcluido:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};
