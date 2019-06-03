const { schemaComanda } = require('../../../schema/api/comanda'),
    { ObjectIdCast } = require('../../../utils');

exports.cadastrarComanda = async comanda => {
    try
    {
        let novaComanda = new schemaComanda(comanda);

        return await schemaComanda.create(novaComanda);
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarComanda:', error);
    }
};

exports.obterComandaLider = clienteId => {
    try {
        return schemaComanda.findOne(
            {
                grupo:
                {
                    $elemMatch: {
                        cliente: ObjectIdCast(clienteId),
                        lider: true
                    }
                }
            }
        ).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterComandaLider:', error);
    }
};

exports.obterComanda = comandaId => {
    try {
        return schemaComanda.findOne(
            {
                _id: comandaId
            }
        ).exec();
    }catch(error){
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterComanda:', error);
    }
};

exports.alterarGrupoComanda = async (comandaId, grupo) => {

    try {

        let comandaAlterada = await schemaComanda.findOneAndUpdate(
            {
                _id: ObjectIdCast(comandaId)
            },
            {
                $set: {
                    grupo: grupo
                }
            }).exec();

        if (!comandaAlterada)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarGrupoComanda:', error);
        return false;
    }
};

exports.cadastrarItemComanda = async (comandaId, produtos, valorTotal) => {

    try {

        let comandaAlterada = await schemaComanda.findOneAndUpdate(
            {
                _id: ObjectIdCast(comandaId)
            },
            {
                $set: {
                    produtos: produtos,
                    valorTotal: valorTotal
                }
            }).exec();

        if (!comandaAlterada)
            return false;

        return true;
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarItemComanda:', error);
        return false;
    }
};