/* eslint-disable no-undef */
const { schemaCorreio } = require('../../../schema/api/correio'),
    { ObjectIdCast } = require('../../../utils');

exports.cadastrarCorreio = async correio => {
    try
    {
        let novoCorreio = new schemaCorreio(correio);

        return await schemaCorreio.create(novoCorreio);
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarCorreio:', error);
    }
};

exports.obterCorreio = async clienteId => {
    try {
        return schemaCorreio.findOne({
            cliente: ObjectIdCast(clienteId)
        }).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterCorreio:', error);
    }
};

exports.marcarMensagemComoLida = async (clienteId, mensagemId) => {
    try
    {
        return schemaCorreio.findOneAndUpdate(
            {
                cliente:ObjectIdCast(clienteId),
                'correio._id':ObjectIdCast(mensagemId)
            },
            {
                '$set' :
                {
                    'correio.$.lida':true
                }
            }).exec();
    }
    catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in marcarMensagemComoLida:', error);
    }
};

exports.alterarCorreio = async correio => {
    try {
        return schemaCorreio.findOneAndUpdate(
            {
                cliente: ObjectIdCast(correio.cliente)
            },
            {
                $set: {
                    correio: correio.correio
                }
            })
            .exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarCorreio:', error);
    }
};


exports.marcarAcaoExecutadaMensagem = async (clienteId, comandaId) => {
    try {
        return schemaCorreio.findOneAndUpdate(
            {
                cliente: ObjectIdCast(clienteId),
                'correio.acao.comanda':ObjectIdCast(comandaId),
                'correio.status': true
            },
            {
                $set: {
                    'correio.$.acao.executouAcao':true,
                    'correio.$.status': false
                }
            })
            .exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in marcarAcaoExecutadaMensagem:', error);
    }
};