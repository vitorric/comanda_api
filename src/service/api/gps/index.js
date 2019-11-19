const { CalcularDistanciaLatLong } = require('../../../utils/GPS'),
    { obterEstabelecimento } = require('../../../repository/api/estabelecimento');


exports.ValidarClientePertoEstabelecimento = async (estabelecimentoId, coordenadas) => {
    try
    {
        let estabelecimento = await obterEstabelecimento(estabelecimentoId);

        if (CalcularDistanciaLatLong(estabelecimento.coordenadas.lat, estabelecimento.coordenadas.long, coordenadas.lat, coordenadas.long, 'K'))
        {
            return {status: true};
        }

        return {status: true};
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in ValidarClientePertoEstabelecimento:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};