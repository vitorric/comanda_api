const { cadastrarDesafio, obterDesafio, listarDesafiosEstab, obterDesafioEstab, alterarDesafioEstab } = require('../../../repository/api/desafio'),
    { obterClienteDesafio, alterarGoldsEstabelecimento, alterarClienteParaDesafio } = require('../../../repository/api/cliente'),
    { obterEstabelecimento, adicionarDesafiosAoEsabelecimento } = require('../../../repository/api/estabelecimento'),
    { InserirMensagemNoCorreio } = require('../../../service/api/correio'),
    { FBCadastrarDesafio } = require('../../firebase/estabelecimento'),
    { cadastrarHistoricoCompra } = require('../../../repository/api/historicoCompraLojas'),
    { gerarChaveAmigavel } = require('../../../utils');

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
            !desafio.premio.quantidade)
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };

        let estabelecimento = await obterEstabelecimento(estabelecimentoId);

        if (!estabelecimento)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        desafio.estabelecimento = estabelecimentoId;

        let desafioCadastrado = await cadastrarDesafio(desafio);

        if (!desafioCadastrado)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        estabelecimento.desafios.push(desafioCadastrado._id);

        let desafioAdicionado = await adicionarDesafiosAoEsabelecimento(estabelecimentoId, estabelecimento.desafios);

        if (!desafioAdicionado)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        }

        FBCadastrarDesafio(estabelecimentoId, desafio.premio.produto, desafio.objetivo.produto, desafioCadastrado);

        // eslint-disable-next-line no-undef
        return { status: true , objeto: desafioCadastrado };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in CadastrarDesafio:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ObterDesafioCliente = async (desafioId) => {
    try
    {
        if (desafioId == null)
        {
            // eslint-disable-next-line no-undef
            return { status: false , mensagem: Mensagens.DADOS_INVALIDOS };
        }

        let desafio = await obterDesafio(desafioId);

        if (!desafio)
            return { status: true };

        return { status: true , objeto: desafio };
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterDesafioCliente:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.ResgatarRecompensaDesafio = async (desafioId, clienteId) => {

    let desafio = await obterDesafio(desafioId);

    if (!desafio)
        // eslint-disable-next-line no-undef
        return {status: false, mensagem: Mensagens.DADOS_INVALIDOS };

    let cliente = await obterClienteDesafio(clienteId, desafioId);

    if (!cliente)
        // eslint-disable-next-line no-undef
        return {status: false, mensagem: Mensagens.DADOS_INVALIDOS };

    let indexDesafio = cliente.desafios.findIndex(x => x.desafio.toString() == desafio._id.toString());

    if (!cliente.desafios[indexDesafio].concluido)
        // eslint-disable-next-line no-undef
        return {status: false, mensagem: Mensagens.DESAFIO_NAO_CONCLUIDO };

    if (cliente.desafios[indexDesafio].resgatouPremio)
        // eslint-disable-next-line no-undef
        return {status: false, mensagem: Mensagens.DESAFIO_JA_RESGATADO };

    cliente.desafios[indexDesafio].resgatouPremio = true;
    cliente.desafios[indexDesafio].dataResgate = new Date();
    cliente.pontos += 10;


    if (desafio.objetivo.tipo === 'Dinheiro')
    {
        await alterarGoldsEstabelecimento(clienteId, desafio.estabelecimento, desafio.premio);
    }
    if (desafio.objetivo.tipo === 'Produto')
    {
        if (cliente.desafios[indexDesafio].resgatouPremioFisicamente)
            // eslint-disable-next-line no-undef
            return {status: false, mensagem: Mensagens.DESAFIO_JA_RESGATADO_PRODUTO };

        cliente.desafios[indexDesafio].resgatouPremioFisicamente = true;

        let chaveUnica = gerarChaveAmigavel();

        let infoPremio = {
            cliente: cliente._id,
            estabelecimento: desafio.estabelecimento,
            produto: desafio.objetivo.produto,
            quantidade: desafio.premio,
            modoObtido: 'Conquista',
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
                mensagem: 'Apresente o cupom de resgate ' + chaveUnica + ' para o estabelecimento ' + estabelecimento.nome,
                mensagemGrande: 'Apresente o cupom de resgate ' + chaveUnica + ' para o estabelecimento ' + estabelecimento.nome + '. O cupom é valido somente 1x.'
            }
        });
    }

    await alterarClienteParaDesafio(clienteId, cliente);

    return { status: true };
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
        // eslint-disable-next-line no-undef
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
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

exports.AlterarDesafioEstab = async desafio => {
    try
    {
        let desafioAlterado = await alterarDesafioEstab(desafio._id, desafio);

        if (!desafioAlterado){
            // eslint-disable-next-line no-undef
            return { status: false, mensagem: Mensagens.SOLICITACAO_INVALIDA  };
        }

        return { status: true };
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterDesafiosEstab:', error);
        // eslint-disable-next-line no-undef
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};