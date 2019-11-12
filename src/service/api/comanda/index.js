const { cadastrarComanda,
        alterarGrupoComanda,
        obterComandaLider,
        obterComanda,
        cadastrarItemComanda,
        obterGrupoComanda,
        obterProdutosComanda,
        transferirLiderancaGrupo,
        listarComandasEstab,
        obterComandaEstab,
        alterarClientePagouComanda,
        fecharComanda,
        obterMelhorDesafioClienteGrupoPorComanda } = require('../../../repository/api/comanda'),
    { obterClienteCompleto,
        obterClienteChaveUnica,
        listarClientesParaDesafios,
        alterarConfigClienteAtual,
        alterarConfigClienteAtualConvitesComanda,
        alterarConfigClienteAtualComanda,
        listarConvitesComandaEnviados,
        removerClienteEstabelecimento } = require('../../../repository/api/cliente'),
    { obterProduto, alterarProdutoVendido } = require('../../../repository/api/produto'),
    { cadastrarHistoricoComanda } = require('../../../repository/api/historicoComanda'),
    { obterEstabelecimento, alterarClientesNoLocal } = require('../../../repository/api/estabelecimento'),
    { listarDesafiosAtivos } = require('../../../repository/api/desafio'),
    {
        cadastrarDesafioCliente,
        alterarDesafioCliente,
        alterarDesafioClienteCompleto,
        obterDesafioCliente,
        listarDesafioCliente,
        obterDesafioClienteGrupoNaoConcluido,
        deletarDesafioClienteGrupoNaoConcluido } = require('../../../repository/api/desafioCliente'),
    { listarHistoricoComanda } = require('../../../repository/api/historicoComanda'),
    {
        InserirMensagemNoCorreio,
        DesativarMensagemConviteGrupo,
        MarcarAcaoExecutadaMensagem } = require('../../api/correio'),
    {
        FBCadastrarComanda,
        FBInserirMembroNoGrupoComanda,
        FBAlterarGrupoComanda,
        FBAlterarProdutosComanda,
        FBRemoverComanda } = require('../../firebase/comanda'),
    { FBAlterarConvitesComanda, FBLimparConvites, FBSairDoEstabelecimento } = require('../../firebase/cliente'),
    { FBAlterarDesafios, FBDeletarDesafios } = require('../../firebase/desafios'),
    { NotificacaoConviteGrupo, NotificacaoItemAdicionadoComanda, NotificacaoDesafioConcluido, NotificacaoComandaCriada } = require('../../firebase/notificacao'),
    { AlterarExp } = require('../../api/avatar'),
    { CalcularDistanciaLatLong } = require('../../../utils/GPS');

function alterarProdutosNaComanda (produtos, produtoId, preco, quantidade)
{
    let encontrou = false;

    produtos.map(function(value) {
        if (value.produto.toString() == produtoId.toString())
        {
            value.preco = Number(preco);
            value.quantidade += Number(quantidade);
            value.precoTotal += Number(quantidade) * Number(preco);
            encontrou = true;
        }
    });

    if (!encontrou)
        produtos.push({
            preco: preco,
            quantidade: quantidade,
            precoTotal: quantidade * preco,
            produto: produtoId
        });

    return produtos;
}

exports.CadastrarComanda = async (estabelecimentoId, clienteId) => {

    try
    {
        let cliente = await obterClienteCompleto(clienteId);

        if (!cliente)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let estabelecimento = await obterEstabelecimento(estabelecimentoId);

        if (!estabelecimento.configEstabelecimentoAtual.estaAberta)
            return { status: false, mensagem: Mensagens.ESTABELECIMENTO_FECHADO };

        // if (typeof cliente.configClienteAtual.estabelecimento === 'undefined' || cliente.configClienteAtual.estabelecimento === null || (cliente.configClienteAtual.estabelecimento.toString() != estabelecimentoId))
        //     return { status: false , mensagem: Mensagens.CLIENTE_NAO_ESTA_NO_ESTABELECIMENTO };
        if (typeof cliente.configClienteAtual.estabelecimento !== 'undefined' && cliente.configClienteAtual.estabelecimento !== null && cliente.configClienteAtual.estabelecimento.toString() != estabelecimentoId)
            return { status: false , mensagem: Mensagens.CLIENTE_ESTA_EM_OUTRO_ESTABELECIMENTO };

        if (cliente.configClienteAtual.comanda != null)
            return { status: false , mensagem: Mensagens.CLIENTE_JA_TEM_COMANDA };

        let comanda = {};
        comanda.estabelecimento = estabelecimentoId;
        comanda.grupo = [];
        comanda.grupo.push({ cliente: cliente._id, lider: true });
        comanda.status = 1;

        let comandaCriada = await cadastrarComanda(comanda);

        if (!comandaCriada)
        {
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        cliente.configClienteAtual.comanda = comandaCriada._id;
        //insere o cliente no estabelecimento
        cliente.configClienteAtual.estabelecimento = estabelecimentoId;
        cliente.configClienteAtual.nomeEstabelecimento = estabelecimento.nome;
        cliente.configClienteAtual.estaEmUmEstabelecimento = true;

        let configAlterada = await alterarConfigClienteAtual(cliente._id, cliente.configClienteAtual);

        if (!configAlterada)
        {
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        estabelecimento.configEstabelecimentoAtual.clientesNoLocal.push(clienteId);

        alterarClientesNoLocal(estabelecimentoId, estabelecimento.configEstabelecimentoAtual.clientesNoLocal);

        FBCadastrarComanda(comandaCriada, cliente.apelido, cliente._id, cliente.avatar, cliente.sexo, cliente.configClienteAtual);

        let tokensFirebase = [];

        cliente.tokenFirebase.forEach(element => {
            tokensFirebase.push(element.token);
        });

        NotificacaoComandaCriada(tokensFirebase, estabelecimento.nome);

        return { status: true , objeto: comandaCriada };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarComanda:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.EnviarConviteGrupo = async (clienteIdLider,clienteApelidoLider, membro) => {
    try
    {
        //procura a comanda do lider
        let comandaLider = await obterComandaLider(clienteIdLider);

        if (!comandaLider)
        {
            return { status: false , mensagem: Mensagens.LIDER_COMANDA_NAO_ENCONTRADO };
        }

        //procura o membro a ser adicionado
        let clienteMembro = await obterClienteChaveUnica(membro.chaveAmigavel);

        if (!clienteMembro)
            return {status: false, mensagem: Mensagens.MEMBRO_COMANDA_NAO_ENCONTRADO};

        //verifica se o cliente membro esta em algum estabelecimento
        if (!clienteMembro.configClienteAtual.estabelecimento)
            return { status: false , mensagem: Mensagens.CLIENTE_NAO_ESTA_NO_ESTABELECIMENTO };

        //verifica se encontrou o cliente membro
        if (!clienteMembro)
            return { status: false , mensagem: Mensagens.MEMBRO_COMANDA_NAO_ENCONTRADO };

        //verifica se o membro ja tem alguma comanda
        if (typeof clienteMembro.configClienteAtual.comanda !== 'undefined' && clienteMembro.configClienteAtual.comanda !== null)
            return { status: false , mensagem: Mensagens.CLIENTE_JA_TEM_COMANDA };

        let indexConvite = clienteMembro.configClienteAtual.convitesComanda.findIndex(x =>
            x.comanda.toString() == comandaLider._id.toString()
        );

        if (indexConvite > -1)
        {
            return { status: false, mensagem: Mensagens.CONVITE_CLIENTE_JA_CONVIDADO };
        }

        clienteMembro.configClienteAtual.convitesComanda.push({
            liderComanda: clienteIdLider,
            comanda: comandaLider._id,
            dataConvite: new Date()
        });

        let conviteEnviado = await alterarConfigClienteAtualConvitesComanda(clienteMembro._id, clienteMembro.configClienteAtual.convitesComanda);

        if (!conviteEnviado)
        {
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        //altera a lista de convites do cliente no firebase
        FBAlterarConvitesComanda(clienteMembro._id, clienteMembro.configClienteAtual.convitesComanda);

        let tokensFirebase = [];

        clienteMembro.tokenFirebase.forEach(element => {
            tokensFirebase.push(element.token);
        });

        //insere mensagem no correio
        InserirMensagemNoCorreio({
            cliente: clienteMembro._id,
            correio: {
                titulo: 'Convite para Grupo',
                mensagem: 'Hey, o ' + clienteApelidoLider + ' esta te convidando para um grupo!',
                mensagemGrande: 'Aceite o convite, interaja com os outros membros do grupo, dívida sua conta e participe dos desafios exclusivos para grupos!',
                acao: {
                    tipo: 'ConviteGrupo',
                    comanda: comandaLider._id
                }
            }
        });

        NotificacaoConviteGrupo(tokensFirebase, clienteApelidoLider);

        return { status: true, mensagem: Mensagens.CONVITE_COMANDA_ENVIADO };
    }
    catch(error){
        console.log('\x1b[31m%s\x1b[0m', 'Erro in EnviarConviteGrupo:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ListarConvitesComandaEnviados = async comandaId => {

    try
    {
        let convitesEnviados = await listarConvitesComandaEnviados(comandaId);
        return { status: true, objeto: convitesEnviados };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarConvitesComandaEnviados:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.CancelarConviteGrupo = async (clienteIdLider, membro) => {
    try
    {
        //procura a comanda do lider
        let comandaLider = await obterComandaLider(clienteIdLider);

        if (!comandaLider)
        {
            return { status: false , mensagem: Mensagens.LIDER_COMANDA_NAO_ENCONTRADO };
        }

        //procura o membro a ser adicionado
        let clienteMembro = await obterClienteChaveUnica(membro.chaveAmigavel);

        //verifica se encontrou o cliente membro
        if (!clienteMembro)
            return { status: false , mensagem: Mensagens.MEMBRO_COMANDA_NAO_ENCONTRADO };

        let indexConvite = clienteMembro.configClienteAtual.convitesComanda.findIndex(x =>
            x.comanda.toString() == comandaLider._id.toString()
        );


        if (indexConvite > -1)
        {
            clienteMembro.configClienteAtual.convitesComanda.splice(indexConvite, 1);
        }

        if (indexConvite === -1)
        {
            return { status: false , mensagem: Mensagens.CONVITE_NAO_ENCONTRADO };
        }

        let conviteEnviado = await alterarConfigClienteAtualConvitesComanda(clienteMembro._id, clienteMembro.configClienteAtual.convitesComanda);

        if (!conviteEnviado)
        {
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        FBAlterarConvitesComanda(clienteMembro._id, clienteMembro.configClienteAtual.convitesComanda);
        DesativarMensagemConviteGrupo(clienteMembro._id, comandaLider._id);

        return { status: true };
    }
    catch(error){
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CancelarConviteGrupo:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.RespostaConviteGrupo = async (clienteId, infoResposta) =>
{
    try
    {
        //procura a comanda do convite
        let comanda = await obterComanda(infoResposta.comanda);

        if (!comanda)
        {
            return { status: false , mensagem: Mensagens.COMANDA_NAO_ENCOTRADA };
        }

        //procura o membro a ser adicionado
        let clienteMembro = await obterClienteCompleto(clienteId);

        //verifica se encontrou o cliente membro
        if (!clienteMembro)
            return { status: false , mensagem: Mensagens.MEMBRO_COMANDA_NAO_ENCONTRADO };

        if (infoResposta.aceitou)
        {
            //verifica se o cliente membro esta em algum estabelecimento
            if (!clienteMembro.configClienteAtual.estabelecimento)
                return { status: false , mensagem: Mensagens.CLIENTE_NAO_ESTA_NO_ESTABELECIMENTO_APP };

            //verifica se o cliente membro esta no mesmo estabelecimento da
            if (clienteMembro.configClienteAtual.estabelecimento.toString() !== comanda.estabelecimento.toString())
                return { status: false , mensagem: Mensagens.CLIENTE_ESTABELECIMENTO_DIFERENTE_APP };

            //verifica se o membro ja tem alguma comanda
            if (typeof clienteMembro.configClienteAtual.comanda !== 'undefined' && clienteMembro.configClienteAtual.comanda !== null)
                return { status: false , mensagem: Mensagens.CLIENTE_JA_TEM_COMANDA };

            //obtem o estabelecimento pra conferir a coordenada
            let estabelecimento = await obterEstabelecimento(clienteMembro.configClienteAtual.estabelecimento);

            if (CalcularDistanciaLatLong(estabelecimento.coordenadas.lat, estabelecimento.coordenadas.long, infoResposta.coordenadas.lat, infoResposta.coordenadas.long, 'K'))
            {
                return {status: false, mensagem: Mensagens.CLIENTE_LONGE_ESTABELECIMENTO };
            }

            //atribui a comanda pro membro tambem e zera os convites
            await alterarConfigClienteAtualComanda(clienteMembro._id, comanda._id);

            //adiciona o membro no grupo da comanda
            comanda.grupo.push({
                cliente: clienteMembro._id
            });

            //altera a comanda
            let grupoAlterado = await alterarGrupoComanda(comanda._id, comanda.grupo);

            if (!grupoAlterado)
            {
                return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
            }
        }

        if (!infoResposta.aceitou)
        {
            let indexConvite = clienteMembro.configClienteAtual.convitesComanda.findIndex(x =>
                x.comanda.toString() == infoResposta.comanda.toString()
            );

            if (indexConvite > -1)
            {
                clienteMembro.configClienteAtual.convitesComanda.splice(indexConvite, 1);
            }

            let conviteEnviado = await alterarConfigClienteAtualConvitesComanda(clienteMembro._id, clienteMembro.configClienteAtual.convitesComanda);

            if (!conviteEnviado)
            {
                return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
            }

        }

        if (infoResposta.aceitou)
        {
            //limpa os outros convites
            FBLimparConvites(clienteId);
            //insere membro no grupo
            clienteMembro.configClienteAtual.comanda = comanda._id;

            let grupoComandaFB = await obterGrupoComanda(comanda._id);

            FBInserirMembroNoGrupoComanda(grupoComandaFB, clienteMembro._id, clienteMembro.configClienteAtual);
        }

        if (!infoResposta.aceitou)
        {
            //remove o convite da comanda
            FBAlterarConvitesComanda(clienteId, clienteMembro.configClienteAtual.convitesComanda);
        }

        //marcar que a mensagem do correio foi executada com sucesso
        MarcarAcaoExecutadaMensagem(clienteId, comanda._id);

        return { status: true };

    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in RespostaConviteGrupo:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.TransferirLiderancaGrupo = async (comandaId, clienteLiderId, clienteNovoLiderId) => {
    try
    {
        await transferirLiderancaGrupo(comandaId,clienteLiderId, false);
        await transferirLiderancaGrupo(comandaId,clienteNovoLiderId, true);

        let grupoAlterado = await obterGrupoComanda(comandaId);

        FBAlterarGrupoComanda(grupoAlterado);

        return { status: true };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in TransferirLiderancaGrupo:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.CadastrarItemComanda = async (estabelecimentoId, produtoComanda) => {

    try
    {
        if (!estabelecimentoId ||
            !produtoComanda.comandaId ||
            !produtoComanda.produto)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let comanda = await obterComanda(produtoComanda.comandaId);
        let produto = await obterProduto(produtoComanda.produto);

        if (!produto || !comanda)
        {
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        if (produto.estoque < produtoComanda.quantidade)
        {
            return { status: false , mensagem: Mensagens.ITEM_LOJA_SEM_ESTOQUE };
        }

        alterarProdutosNaComanda(comanda.produtos, produtoComanda.produto, produto.preco, produtoComanda.quantidade);

        let precoTotalDaCompra = produto.preco * produtoComanda.quantidade;

        comanda.valorTotal += precoTotalDaCompra;

        produto.estoque -= parseInt(produtoComanda.quantidade);

        produto.quantidadeVendida += parseInt(produtoComanda.quantidade);

        let comandaAlterada = await cadastrarItemComanda(comanda._id, comanda.produtos, comanda.valorTotal);

        if (!comandaAlterada)
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };

        alterarProdutoVendido(produto._id, produto.estoque, produto.quantidadeVendida);

        let idsClientes = [];

        comanda.grupo.forEach(element => {
            idsClientes.push(element.cliente);
        });

        let todosClientesDoGrupo = await listarClientesParaDesafios(idsClientes);

        let produtoFirebase = await obterProdutosComanda(comanda._id);
        let tokensFirebase = [];

        let tokensFirebaseDesafioConcluido = [];

        //Alterar o firebase da comanda com o produto novo
        FBAlterarProdutosComanda(produtoFirebase, comanda.valorTotal);

        todosClientesDoGrupo.forEach(element => {
            AlterarExp(element._id, element.avatar, 10);

            if (typeof element.tokenFirebase !== 'undefined')
            {
                element.tokenFirebase.forEach(tokens => {
                    tokensFirebase.push(tokens.token);
                });
            }
        });

        if (comanda.grupo.length === 1) {

            let desafiosSozinho = await listarDesafiosAtivos(produto._id, estabelecimentoId, false);

            if (typeof desafiosSozinho !== 'undefined' && desafiosSozinho.length > 0)
            {
                //para cada desafio
                const promiseDesafios = await desafiosSozinho.map(async desafio => {

                    //varre todos os clientes da comanda
                    const promiseDesafioCliente = todosClientesDoGrupo.map(async cliente =>
                    {
                        let desafioCliente = await obterDesafioCliente(cliente._id, desafio._id);

                        //verifica se o desafio ja foi concluido
                        //encontrou o desafio
                        if (desafioCliente !== null && desafioCliente.concluido === false)
                        {
                            if (desafio.objetivo.tipo === 'Produto')
                                desafioCliente.progresso += parseInt(produtoComanda.quantidade);

                            if (desafio.objetivo.tipo === 'Dinheiro')
                                desafioCliente.progresso += parseInt(precoTotalDaCompra);
                        }

                        if (desafioCliente === null)
                        {
                            let novoDesafio = {
                                cliente: cliente._id,
                                desafio: desafio._id,
                                estabelecimento: estabelecimentoId,
                                progresso: (desafio.objetivo.tipo === 'Produto') ? produtoComanda.quantidade : precoTotalDaCompra,
                                premio: desafio.premio
                            };

                            desafioCliente = await cadastrarDesafioCliente(novoDesafio);
                        }

                        if (desafioCliente.progresso >= desafio.objetivo.quantidade)
                        {
                        //desafio concluido
                            if (typeof desafioCliente.concluido === 'undefined' || desafioCliente.concluido === false)
                            {

                                cliente.tokenFirebase.forEach(tokens => {
                                    if (typeof tokensFirebaseDesafioConcluido[tokens.token] === 'undefined' || !tokensFirebaseDesafioConcluido[tokens.token])
                                        tokensFirebaseDesafioConcluido.push(tokens.token);
                                });

                                desafioCliente.progresso = parseInt(desafio.objetivo.quantidade);
                                desafioCliente.concluido = true;
                                desafioCliente.dataConclusao = new Date();

                                await alterarDesafioClienteCompleto(desafioCliente.cliente, desafioCliente);
                            }
                        }

                        if (desafioCliente.progresso < desafio.objetivo.quantidade)
                            await alterarDesafioCliente(desafioCliente.cliente, desafioCliente);
                    });

                    await Promise.all(promiseDesafioCliente);
                });

                await Promise.all(promiseDesafios);
            }
        }

        if (comanda.grupo.length > 1){

            let desafiosGrupo = await listarDesafiosAtivos(produto._id, estabelecimentoId, true);

            if (typeof desafiosGrupo !== 'undefined' && desafiosGrupo.length > 0)
            {
                //para cada desafio
                const promiseDesafios = await desafiosGrupo.map(async desafio => {

                    let desafioCliente = await obterMelhorDesafioClienteGrupoPorComanda(comanda._id, desafio._id);

                    if (typeof desafioCliente !== 'undefined' && desafioCliente.concluido) {
                        return;
                    }

                    let ganhadorDesafio = null;

                    //verifica se o desafio ja foi concluido
                    //encontrou o desafio
                    if (typeof desafioCliente !== 'undefined' && desafioCliente.concluido === false)
                    {
                        if (desafio.objetivo.tipo === 'Produto')
                            desafioCliente.progresso += parseInt(produtoComanda.quantidade);

                        if (desafio.objetivo.tipo === 'Dinheiro')
                            desafioCliente.progresso += parseInt(precoTotalDaCompra);
                    }

                    //varre todos os clientes da comanda
                    const promiseDesafioCliente = todosClientesDoGrupo.map(async cliente =>
                    {
                        let novoDesafioCliente = desafioCliente;

                        if (typeof novoDesafioCliente === 'undefined') {
                            let novoDesafio = {
                                cliente: cliente._id,
                                desafio: desafio._id,
                                estabelecimento: estabelecimentoId,
                                progresso: (desafio.objetivo.tipo === 'Produto') ? produtoComanda.quantidade : precoTotalDaCompra,
                                premio: desafio.premio
                            };

                            novoDesafioCliente = await cadastrarDesafioCliente(novoDesafio);
                        }

                        if (novoDesafioCliente.progresso >= desafio.objetivo.quantidade) {
                            cliente.tokenFirebase.forEach(tokens => {
                                if (typeof tokensFirebaseDesafioConcluido[tokens.token] === 'undefined' || !tokensFirebaseDesafioConcluido[tokens.token])
                                    tokensFirebaseDesafioConcluido.push(tokens.token);
                            });

                            if (desafio.premio.tipo === 'Produto') {
                                if (ganhadorDesafio === null) {
                                    ganhadorDesafio = todosClientesDoGrupo[Math.floor(Math.random() * todosClientesDoGrupo.length)]._id;
                                }

                                novoDesafioCliente.premio = {
                                    tipo: desafio.premio.tipo,
                                    quantidade: desafio.premio.quantidade,
                                    produto: desafio.premio.produto,
                                    ganhador: ganhadorDesafio
                                };
                            }

                            if (desafio.premio.tipo === 'CPGold') {
                                novoDesafioCliente.premio = {
                                    tipo: desafio.premio.tipo,
                                    quantidade: parseInt(desafio.premio.quantidade / todosClientesDoGrupo.length)
                                };
                            }

                            novoDesafioCliente.progresso = parseInt(desafio.objetivo.quantidade);
                            novoDesafioCliente.concluido = true;
                            novoDesafioCliente.dataConclusao = new Date();

                            await alterarDesafioClienteCompleto(cliente._id, novoDesafioCliente);
                        }

                        await alterarDesafioCliente(cliente._id, novoDesafioCliente);
                    });

                    await Promise.all(promiseDesafioCliente);
                });

                await Promise.all(promiseDesafios);
            }
        }

        const promise = todosClientesDoGrupo.map(async cliente => {
            let desafiosClientes = await listarDesafioCliente(cliente._id);
            FBAlterarDesafios(cliente._id, desafiosClientes);
        });

        await Promise.all(promise);

        cadastrarHistoricoComanda({
            comanda: comanda._id,
            estabelecimento: comanda.estabelecimento,
            nomeProduto: produto.nome,
            iconProduto: produto.icon,
            quantidade: produtoComanda.quantidade,
            valorTotal: precoTotalDaCompra
        });

        if (tokensFirebase.length > 0)
            NotificacaoItemAdicionadoComanda(tokensFirebase, produtoComanda.quantidade, produto.nome);

        if (tokensFirebaseDesafioConcluido.length > 0)
            NotificacaoDesafioConcluido(tokensFirebaseDesafioConcluido);

        return { status: true, objeto: { valorTotal: comanda.valorTotal, produtosComanda: produtoFirebase } };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarItemComanda:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ListarComandasEstab = async estabelecimentoId => {
    try
    {
        let comandas = await listarComandasEstab(estabelecimentoId);

        return { status: true, objeto: comandas };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarComandasEstab:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ObterComandasEstab = async comandaId => {
    try
    {
        let comanda = await obterComandaEstab(comandaId);

        return { status: true, objeto: comanda };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterComandasEstab:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ClientePagarComanda = async (estabelecimentoId, {clienteId, comandaId, valorPago}) => {
    try
    {
        let comanda = await obterComanda(comandaId);

        if (!comanda)
            return { status: false , mensagem: Mensagens.COMANDA_NAO_ENCOTRADA };

        let cliente = await obterClienteCompleto(clienteId);

        if (!cliente)
            return { status: false , mensagem: Mensagens.CLIENTE_NAO_ENCONTRADO };

        let estabelecimento = await obterEstabelecimento(estabelecimentoId);

        if (!estabelecimento)
            return { status: false, mensagem: Mensagens.ESTABELECIMENTO_NAO_ENCONTRADO };

        //obtem o cliente que vai pagar a comanda
        let clienteComanda = comanda.grupo.filter(integrante => {
            return integrante.cliente.toString() === clienteId && !integrante.jaPagou;
        })[0];

        //se nao encontrar o cliente, ou ele nao esta na comanda ou ja pagou
        if (!clienteComanda)
            return { status: false , mensagem: Mensagens.CLIENTE_NAO_ENCONTRADO_OU_PAGOU };

        //obtem o valor total pago pelos clientes na comanda
        let valorPagoTotal = comanda.grupo.reduce((a, b) => a + (b['valorPago'] || 0), 0);

        //obtem quantas pessoas na comanda ainda nao pagaram
        let pessoasNaoPagaramNoGrupo = comanda.grupo.filter(integrante => {
            return !integrante.jaPagou;
        });
        console.log('valorPagoTotal: ', valorPagoTotal);
        let valorRestanteAPagar = (comanda.valorTotal - valorPagoTotal);

        //verifica se o valor que o cliente ira pagar eh menor que o restante e se tem somente 1 no grupo
        if (valorPago < valorRestanteAPagar && pessoasNaoPagaramNoGrupo.length === 1)
            return { status: false , mensagem: Mensagens.PAGAMENTO_VALOR_INVALIDO };

        if (valorPago > valorRestanteAPagar)
            return { status: false , mensagem: Mensagens.PAGAMENTO_VALOR_MAIOR };

        let valorTotalAPagar = (valorRestanteAPagar - valorPago);

        //verifica se o cliente que esta pagando eh o lider do grupo, caso seja, a lideranca eh transferida para o proximo membro do grupo que ainda nao pagou,
        //se o cliente atual pagar tudo, nao transfere a lideranca
        if (clienteComanda.lider && pessoasNaoPagaramNoGrupo.length > 1 && valorTotalAPagar > 0)
        {
            let novoLider = pessoasNaoPagaramNoGrupo.filter(integrante => {
                return integrante.cliente.toString() !== clienteId;
            })[0];

            transferirLiderancaGrupo(comandaId, clienteId, false);
            transferirLiderancaGrupo(comandaId, novoLider.cliente, true);
        }

        //altera a comanda informando que o cliente pagou
        await alterarClientePagouComanda(comandaId, clienteId, valorPago);

        let grupoAlterado = await obterGrupoComanda(comandaId);
        let fechar = (pessoasNaoPagaramNoGrupo.length === 1 || valorTotalAPagar === 0) ? true : false;

        let clientesId = [];

        //se tiver apenas o cliente pagante no grupo, fecha a comanda
        if (fechar)
        {
            pessoasNaoPagaramNoGrupo.forEach((cliente) => {
                clientesId.push(cliente.cliente);
            });
            fecharComanda(comandaId, new Date());
            FBRemoverComanda(comandaId);
        }

        if (!fechar)
        {
            clientesId.push(cliente._id);
            FBAlterarGrupoComanda(grupoAlterado);
        }

        //retira a comanda do cliente e remove ele do estabelecimento
        removerClienteEstabelecimento(clientesId);
        //remove do firebase
        FBSairDoEstabelecimento(clientesId);

        //busca os desafios em grupo do cliente que nao foram concluidos
        let desafiosGrupoNaoConcluidos = await obterDesafioClienteGrupoNaoConcluido(clientesId);

        //remove os desafios em grupo não concluido
        if (desafiosGrupoNaoConcluidos.length > 0) {

            let desafioIds = [];
            let desafioClienteIds = [];
            desafiosGrupoNaoConcluidos.forEach(element => {
                desafioClienteIds.push(element._id);
                desafioIds.push(element.desafio._id);
            });
            //remove todos os desafios em grupo nao concluido
            deletarDesafioClienteGrupoNaoConcluido(desafioClienteIds);
            //remove os desafios do firebase
            FBDeletarDesafios(clientesId, desafioIds);
        }

        //remove o cliente do estabelecimento
        let clientesAtuaisNoEstab = [];

        clientesId.forEach(x => clientesAtuaisNoEstab.push(x.toString()));

        clientesAtuaisNoEstab = estabelecimento.
            configEstabelecimentoAtual.
            clientesNoLocal.filter(item => !clientesAtuaisNoEstab.includes(item.toString()));

        // let clientesAtuaisNoEstab = estabelecimento.configEstabelecimentoAtual.clientesNoLocal.filter(cliente => {
        //     return cliente.toString() !== clienteId.toString();
        // });
        alterarClientesNoLocal(estabelecimentoId, clientesAtuaisNoEstab);

        return { status: true };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ClientePagarComanda:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ListarHistoricoComanda = async comandaId => {
    try
    {
        let historicoComanda = await listarHistoricoComanda(comandaId);

        return { status: true, objeto: historicoComanda };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarHistoricoComanda:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};