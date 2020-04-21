const { schemaClienteEstabelecimento } = require('../../../schema/api/clienteEstabelecimento'),
    { ObjectIdCast } = require('../../../utils');

exports.cadastrarClienteEstabelecimento = async cliente => {
    try
    {
        let clienteNovo = new schemaClienteEstabelecimento(cliente);

        return await schemaClienteEstabelecimento.create(clienteNovo);
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarClienteEstabelecimento:', error);
    }
};

exports.obterClienteEstabelecimento = clienteEstabelecimento => {
    try
    {
        return schemaClienteEstabelecimento.findOne({
            _id: ObjectIdCast(clienteEstabelecimento)
        }, {__v: 0, createdAt: 0, updatedAt: 0, estabelecimento: 0 }).exec();
    }
    catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterClienteEstabelecimento:', error);
    }
};

exports.alterarClienteEstabelecimento = async (clienteId, {nome, contatoUm, contatoDois, dataNascimento, status}) => {

    try {

        let clienteAlterado = await schemaClienteEstabelecimento.findOneAndUpdate(
            {
                _id: ObjectIdCast(clienteId)
            },
            {
                $set: {
                    nome,
                    contatoUm,
                    contatoDois,
                    dataNascimento,
                    status
                }

            }).exec();

        if (!clienteAlterado){
            return false;
        }

        return true;
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarClienteEstabelecimento:', error);
    }
};

exports.listarClientesEstabelecimento = async (estabelecimentoId, nomeCliente) => {
    try
    {
        return await schemaClienteEstabelecimento.aggregate([
            {
                $match: {
                    estabelecimento: ObjectIdCast(estabelecimentoId),
                    status: { $lt: 2 } ,
                    nome: {'$regex' : nomeCliente, '$options' : 'i'}
                }
            }
        ]).exec();
    }
    catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarClientesEstabelecimento:', error);
    }
};