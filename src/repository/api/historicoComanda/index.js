const { schemaHistoricoComanda } = require('../../../schema/api/historicoComanda'),
    { ObjectIdCast } = require('../../../utils');

exports.cadastrarHistoricoComanda = async (infoHistorico) =>
{
    try
    {
        let novoHistoricoCompra = new schemaHistoricoComanda(infoHistorico);

        return await schemaHistoricoComanda.create(novoHistoricoCompra);
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarHistoricoComanda:', error);
        return false;
    }
};

exports.listarHistoricoComanda = comandaId => {
    try
    {
        return schemaHistoricoComanda.aggregate([
            {
                $match:
                {
                    comanda: ObjectIdCast(comandaId)
                }
            },
            {
                $sort:
                {
                    nomeProduto: 1,
                    createdAt: -1
                }
            },
            {
                $project:
                {
                    _id: 0,
                    iconProduto: 1,
                    nomeProduto: 1,
                    quantidade: 1,
                    valorTotal: 1,
                    createdAt: { $dateToString: { format: '%d/%m/%Y %H:%M', date: '$createdAt', timezone: 'America/Sao_Paulo' } }
                }
            }]).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarHistoricoComanda:', error);
    }
};