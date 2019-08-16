const {
        cadastrarDesafio,
        obterDesafio,
        listarDesafiosEstab,
        obterDesafioEstab,
        alterarDesafioEstab,
        alterarDesafioEstabStatus,
        obterDesafioStatusFirebase,
        alterarDesafioStatusFirebase } = require('../../../repository/api/desafio'),
    {
        obterClienteDesafio,
        alterarGoldsEstabelecimento,
        alterarClienteParaDesafio
    } = require('../../../repository/api/cliente'),
    {
        obterEstabelecimento,
        adicionarDesafiosAoEsabelecimento
    } = require('../../../repository/api/estabelecimento'),
    { InserirMensagemNoCorreio } = require('../../../service/api/correio'),
    { cadastrarHistoricoCompra } = require('../../../repository/api/historicoCompraLojas'),
    { gerarChaveAmigavel } = require('../../../utils'),
    { FBAlterarDesafio, FBRemoverDesafio } = require('../../firebase/estabelecimento'),
    { FBAlterarDesafioResgatouPremio } = require('../../firebase/desafios');

exports.CadastrarDesafio = async (estabelecimentoId, desafio) => {
    try
    {
        desafio.objetivo = (typeof desafio.objetivo === 'object') ? desafio.objetivo : JSON.parse(desafio.objetivo);
        desafio.premio = (typeof desafio.premio === 'object') ? desafio.premio : JSON.parse(desafio.premio);

        if (!estabelecimentoId ||
            !desafio.nome ||
            !desafio.tempoDuracao ||
            !desafio.objetivo.tipo ||
            !desafio.objetivo.quantidade ||
            !desafio.premio.tipo ||
            !desafio.premio.quantidade ||
            !desafio.tempoEntrarNoAr)
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let dataEntrar = new Date(desafio.tempoEntrarNoAr);
        let dataSair = new Date(desafio.tempoDisponivel);

        if (dataEntrar < dataSair)
            return { status: false , mensagem: Mensagens.DATA_DE_ENTRADA_MENOR_QUE_SAIDA };

        let estabelecimento = await obterEstabelecimento(estabelecimentoId);

        if (!estabelecimento)
        {
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        desafio.estabelecimento = estabelecimentoId;

        let desafioCadastrado = await cadastrarDesafio(desafio);

        if (!desafioCadastrado)
        {
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        estabelecimento.desafios.push(desafioCadastrado._id);

        let desafioAdicionado = await adicionarDesafiosAoEsabelecimento(estabelecimentoId, estabelecimento.desafios);

        if (!desafioAdicionado)
        {
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        return { status: true , objeto: desafioCadastrado };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarDesafio:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ObterDesafioCliente = async (desafioId) => {
    try
    {
        if (desafioId == null)
        {
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        let desafio = await obterDesafio(desafioId);

        return { status: true , objeto: (desafio === null) ? {} : desafio };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterDesafioCliente:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ResgatarRecompensaDesafio = async (desafioId, clienteId) => {

    try
    {
        let desafio = await obterDesafio(desafioId);

        if (!desafio)
            return {status: false, mensagem: Mensagens.DADOS_INVALIDOS };

        let cliente = await obterClienteDesafio(clienteId, desafioId);

        if (!cliente)
            return {status: false, mensagem: Mensagens.DADOS_INVALIDOS };

        let indexDesafio = cliente.desafios.findIndex(x => x.desafio.toString() === desafio._id.toString());
        console.log(cliente.desafios[indexDesafio]);
        if (!cliente.desafios[indexDesafio].concluido)
            return {status: false, mensagem: Mensagens.DESAFIO_NAO_CONCLUIDO };

        if (cliente.desafios[indexDesafio].resgatouPremio)
            return {status: false, mensagem: Mensagens.DESAFIO_JA_RESGATADO };

        cliente.desafios[indexDesafio].resgatouPremio = true;
        cliente.desafios[indexDesafio].dataResgate = new Date();
        cliente.pontos += 10;


        if (desafio.premio.tipo === 'Dinheiro')
        {
            await alterarGoldsEstabelecimento(clienteId, desafio.estabelecimento, desafio.premio);
        }

        if (desafio.premio.tipo === 'Produto')
        {
            if (cliente.desafios[indexDesafio].resgatouPremioFisicamente)
                return {status: false, mensagem: Mensagens.DESAFIO_JA_RESGATADO_PRODUTO };

            //cliente.desafios[indexDesafio].resgatouPremioFisicamente = true;

            let chaveUnica = gerarChaveAmigavel();

            let infoPremio = {
                cliente: cliente._id,
                estabelecimento: desafio.estabelecimento,
                produto: desafio.premio.produto,
                quantidade: desafio.premio.quantidade,
                modoObtido: 'Desafio',
                chaveUnica: chaveUnica,
                precoItem: 0
            };

            await cadastrarHistoricoCompra(clienteId, infoPremio);

            let estabelecimento = await obterEstabelecimento(desafio.estabelecimento);

            //insere mensagem no correio
            InserirMensagemNoCorreio({
                cliente: cliente._id,
                correio: {
                    titulo: 'Resgate seu prêmio no estabelecimento!',
                    mensagem: 'Apresente o cupom de resgate <color=yellow>' + chaveUnica + '</color> para o estabelecimento ' + estabelecimento.nome,
                    mensagemGrande: 'Apresente o cupom de resgate <color=yellow>' + chaveUnica + '</color> para o estabelecimento ' + estabelecimento.nome + '. O cupom é valido somente 1x.'
                }
            });
        }

        await alterarClienteParaDesafio(clienteId, cliente);
        //TODO: Alterar no FB que cliente resgatou o premio
        FBAlterarDesafioResgatouPremio(clienteId, desafioId);

        return { status: true };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ResgatarRecompensaDesafio:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ListarDesafiosEstab = async estabelecimentoId => {
    try
    {
        let desafios = await listarDesafiosEstab(estabelecimentoId);

        return { status: true, objeto: desafios };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarDesafiosEstab:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ObterDesafioEstab = async (estabelecimentoId, desafioId) => {
    try
    {
        let desafios = await obterDesafioEstab(estabelecimentoId, desafioId);

        return { status: true, objeto: desafios };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterDesafiosEstab:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.AlterarDesafioEstab = async (estabelecimentoId, desafio) => {
    try
    {
        let dataEntrar = new Date(desafio.tempoEntrarNoAr);
        let dataSair = new Date(desafio.tempoDuracao);

        if (dataEntrar > dataSair)
            return { status: false , mensagem: Mensagens.DATA_DE_ENTRADA_MENOR_QUE_SAIDA };

        let desafioAlterado = await alterarDesafioEstab(desafio._id, desafio);

        if (!desafioAlterado)
        {
            return { status: false, mensagem: Mensagens.SOLICITACAO_INVALIDA  };
        }

        if (desafio.status !== 1)
        {
            alterarDesafioStatusFirebase(desafio._id, 0);
            FBRemoverDesafio(estabelecimentoId, desafio._id);
            return { status: true };
        }

        let statusFirebase = await obterDesafioStatusFirebase(desafio._id);

        if (statusFirebase === 2)
            alterarDesafioStatusFirebase(desafio._id, 0);

        if (desafio.status === 1 && statusFirebase === 1)
            FBAlterarDesafio(estabelecimentoId, desafio); 

        return { status: true };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterDesafiosEstab:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.AlterarDesafioEstabStatus = async (estabelecimentoId, {desafioId, status}) => {
    try
    {
        let desafioAlterado = await alterarDesafioEstabStatus(desafioId, status);

        if (!desafioAlterado)
        {
            return { status: false, mensagem: Mensagens.SOLICITACAO_INVALIDA  };
        }

        if (status !== 1)
        {
            alterarDesafioStatusFirebase(desafioId, 0);
            FBRemoverDesafio(estabelecimentoId, desafioId);
            return { status: true };
        }

        return { status: true };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarDesafioEstabStatus:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};