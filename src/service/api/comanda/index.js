const { cadastrarComanda,
        alterarGrupoComanda,
        obterComandaLider,
        obterComanda,
        cadastrarItemComanda  } = require('../../../repository/api/comanda'),
    { obterClienteCompleto,
        obterClienteChaveUnica,
        listarClientesParaDesafios,
        alterarClienteParaDesafio,
        alterarConfigClienteAtual,
        alterarConfigClienteAtualConvitesComanda,
        alterarConfigClienteAtualComanda } = require('../../../repository/api/cliente'),
    { obterProduto, alterarProdutoEstoque } = require('../../../repository/api/produto'),
    { listarDesafiosAtivos } = require('../../../repository/api/desafio'),
    { PONTOS_POR_CONQUISTA } = require('../../../../config/game');

function alterarProdutosNaComanda (produtos, produtoId, preco, quantidade)
{
    let encontrou = false;

    produtos.map(function(value) {
        if (value.produtoId == produtoId)
        {
            value.preco = preco;
            value.quantidade += quantidade;
            value.precoTotal += quantidade * preco;
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


exports.CadastrarComanda = async (estabelecimentoId, comanda) => {

    try
    {

        let cliente = await obterClienteCompleto(comanda.clienteId);

        if (!cliente)
        {
        // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        if (typeof cliente.configClienteAtual.estabelecimento === 'undefined' || (cliente.configClienteAtual.estabelecimento.toString() != estabelecimentoId))
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.CLIENTE_NAO_ESTA_NO_ESTABELECIMENTO };
        if (cliente.configClienteAtual.comanda != null)
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.CLIENTE_JA_TEM_COMANDA };

        comanda.dataEntrada = new Date().getDate();
        comanda.estabelecimento = estabelecimentoId;
        comanda.grupo = [];
        comanda.grupo.push({ cliente: cliente._id, lider: true });

        let comandaCriada = await cadastrarComanda(comanda);

        if (!comandaCriada)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        cliente.configClienteAtual.comanda = comandaCriada._id;

        let configAlterada = await alterarConfigClienteAtual(cliente._id, cliente.configClienteAtual);

        if (!configAlterada)
        {
        // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        return { status: true , objeto: comandaCriada };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarComanda:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.EnviarConviteGrupo = async (clienteIdLider, membro) => {
    try
    {
        //procura a comanda do lider
        let comandaLider = await obterComandaLider(clienteIdLider);

        if (!comandaLider)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.LIDER_COMANDA_NAO_ENCONTRADO };
        }

        //procura o membro a ser adicionado
        let clienteMembro = await obterClienteChaveUnica(membro.chaveAmigavel);

        //verifica se o cliente membro esta em algum estabelecimento
        if (!clienteMembro.configClienteAtual.estabelecimento)
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.CLIENTE_NAO_ESTA_NO_ESTABELECIMENTO };

        //verifica se encontrou o cliente membro
        if (!clienteMembro)
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.MEMBRO_COMANDA_NAO_ENCONTRADO };

        //verifica se o membro ja tem alguma comanda
        if (typeof clienteMembro.configClienteAtual.comanda !== 'undefined' && clienteMembro.configClienteAtual.comanda !== null)
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.CLIENTE_JA_TEM_COMANDA };

        let indexConvite = clienteMembro.configClienteAtual.convitesComanda.findIndex(x =>
            x.comanda.toString() == comandaLider._id.toString()
        );

        if (indexConvite > -1)
        {
            // eslint-disable-next-line no-undef
            return { status: false, mensagem: Mensagens.CONVITE_CLIENTE_JA_CONVIDADO };
        }

        clienteMembro.configClienteAtual.convitesComanda.push({
            liderComanda: clienteIdLider,
            comanda: comandaLider._id
        });

        let conviteEnviado = await alterarConfigClienteAtualConvitesComanda(clienteMembro._id, clienteMembro.configClienteAtual.convitesComanda);

        if (!conviteEnviado)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        // eslint-disable-next-line no-undef
        return { status: true, mensagem: Mensagens.CONVITE_COMANDA_ENVIADO };
    }
    catch(error){
        console.log('\x1b[31m%s\x1b[0m', 'Erro in EnviarConviteGrupo:', error);
        // eslint-disable-next-line no-undef
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
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.LIDER_COMANDA_NAO_ENCONTRADO };
        }

        //procura o membro a ser adicionado
        let clienteMembro = await obterClienteChaveUnica(membro.chaveAmigavel);

        //verifica se encontrou o cliente membro
        if (!clienteMembro)
            // eslint-disable-next-line no-undef
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
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.CONVITE_NAO_ENCONTRADO };
        }

        let conviteEnviado = await alterarConfigClienteAtualConvitesComanda(clienteMembro._id, clienteMembro.configClienteAtual.convitesComanda);

        if (!conviteEnviado)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        // eslint-disable-next-line no-undef
        return { status: true };
    }
    catch(error){
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CancelarConviteGrupo:', error);
        // eslint-disable-next-line no-undef
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
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.COMANDA_NAO_ENCOTRADA };
        }

        //procura o membro a ser adicionado
        let clienteMembro = await obterClienteCompleto(clienteId);

        //verifica se encontrou o cliente membro
        if (!clienteMembro)
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.MEMBRO_COMANDA_NAO_ENCONTRADO };

        if (infoResposta.aceitou)
        {
            //verifica se o cliente membro esta em algum estabelecimento
            if (!clienteMembro.configClienteAtual.estabelecimento)
            // eslint-disable-next-line no-undef
                return { status: false , mensagem: Mensagens.CLIENTE_NAO_ESTA_NO_ESTABELECIMENTO_APP };

            //verifica se o cliente membro esta no mesmo estabelecimento da
            if (clienteMembro.configClienteAtual.estabelecimento.toString() !== comanda.estabelecimento.toString())
            // eslint-disable-next-line no-undef
                return { status: false , mensagem: Mensagens.CLIENTE_ESTABELECIMENTO_DIFERENTE_APP };

            //verifica se o membro ja tem alguma comanda
            if (clienteMembro.configClienteAtual.comanda !== null)
            // eslint-disable-next-line no-undef
                return { status: false , mensagem: Mensagens.CLIENTE_JA_TEM_COMANDA };

            //atribui a comanda pro membro tambem e zera os convites
            await alterarConfigClienteAtualComanda(clienteMembro._id, comanda._id);

            //adiciona o membro no grupo da comanda
            comanda.grupo.push({
                cliente: clienteMembro._id
            });

            //altera a comanda
            let grupoAlterado = alterarGrupoComanda(comanda._id, comanda.grupo);

            if (!grupoAlterado)
            {
                // eslint-disable-next-line no-undef
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
                // eslint-disable-next-line no-undef
                return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
            }

        }

        return { status: true };

    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AdicionarClienteGrupo:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.CadastrarItemComanda = async (estabelecimentoId, produtoComanda) => {

    try
    {
        if (!estabelecimentoId ||
            !produtoComanda.comandaId ||
            !produtoComanda.produto)
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let comanda = await obterComanda(produtoComanda.comandaId);
        let produto = await obterProduto(produtoComanda.produto);

        if (!produto || !comanda)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        if (produto.estoque < produtoComanda.quantidade)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.ITEM_LOJA_SEM_ESTOQUE };
        }

        alterarProdutosNaComanda(comanda.produtos, produtoComanda.produto, produto.preco, produtoComanda.quantidade);

        let precoTotalDaCompra = produto.preco * produtoComanda.quantidade;

        comanda.valorTotal += precoTotalDaCompra;

        produto.estoque -= produtoComanda.quantidade;

        let comandaAlterada = await cadastrarItemComanda(comanda._id, comanda.produtos, comanda.valorTotal);

        if (!comandaAlterada)
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };

        alterarProdutoEstoque(produto._id, produto.estoque);

        let desafios = await listarDesafiosAtivos(produto._id, estabelecimentoId, (comanda.grupo.length > 1) ? true : false);

        let idsClientes = [];

        comanda.grupo.forEach(element => {
            idsClientes.push(element.cliente);
        });

        let todosClientesDoGrupo = await listarClientesParaDesafios(idsClientes);

        if (desafios.length > 0)
        // eslint-disable-next-line no-empty
        {
            console.log('Encontrou desafios');

            //para cada desafio
            await desafios.forEach(async desafio => {

                //varre todos os clientes da comanda
                todosClientesDoGrupo.map(async function(cliente)
                {
                    let indexDesafio = cliente.desafios.findIndex(x => (!x.desafio) ? x.desafio.toString() : '' === desafio._id.toString());

                    //encontrou o desafio
                    if (indexDesafio > -1)
                    {
                        if (desafio.objetivo.tipo === 'Produto')
                            cliente.desafios[indexDesafio].progresso += produtoComanda.quantidade;

                        if (desafio.objetivo.tipo === 'Dinheiro')
                            cliente.desafios[indexDesafio].progresso += precoTotalDaCompra;
                    }

                    if (indexDesafio === -1)
                    {
                        let novoDesafio = {
                            desafio: desafio._id,
                            estabelecimento: estabelecimentoId,
                            progresso: (desafio.objetivo.tipo === 'Produto') ? produtoComanda.quantidade : precoTotalDaCompra
                        };

                        cliente.desafios.push(novoDesafio);
                        indexDesafio = cliente.desafios.length - 1;
                    }

                    if (cliente.desafios[indexDesafio].progresso >= desafio.objetivo.quantidade)
                    {
                        cliente.desafios[indexDesafio].progresso = desafio.objetivo.quantidade;

                        //let indexEstab = cliente.goldPorEstabelecimento.findIndex(el => el.estabelecimento === estabelecimentoId);

                        cliente.desafios[indexDesafio].concluido = true;
                        cliente.desafios[indexDesafio].dataConclusao = new Date();

                        //cliente.goldPorEstabelecimento[indexEstab].gold += desafio.premio;
                        cliente.pontos += PONTOS_POR_CONQUISTA;
                    }

                    await alterarClienteParaDesafio(cliente._id, cliente);
                });
            });

        }

        return { status: true };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarItemComanda:', error);
    }
};