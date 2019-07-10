const { cadastrarDesafio } = require('../../../repository/api/desafio'),
    { obterEstabelecimento, adicionarDesafiosAoEsabelecimento } = require('../../../repository/api/estabelecimento'),
    { FBCadastrarDesafio } = require('../../firebase/estabelecimento');

exports.CadastrarDesafio = async (estabelecimentoId, desafio) => {
    try
    {
        desafio.objetivo = (typeof desafio.objetivo === 'object') ? desafio.objetivo : JSON.parse(desafio.objetivo);

        if (!estabelecimentoId ||
            !desafio.nome ||
            !desafio.tempoDuracao ||
            !desafio.objetivo.tipo ||
            !desafio.objetivo.quantidade)
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

        FBCadastrarDesafio(estabelecimentoId, desafio.objetivo.produto, desafioCadastrado);

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