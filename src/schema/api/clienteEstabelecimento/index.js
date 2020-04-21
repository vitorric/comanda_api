const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');

const ClienteEstabelecimentoSchema = new Schema(
    {
        email: {
            type: String
        },
        status: {
            type: Boolean,
            required: false,
            default: 1
        },
        estabelecimento:{
            type: Schema.Types.ObjectId,
            ref: 'estabelecimento'
        },
        nome:{
            type: String,
            required: true
        },
        cpf:{
            type: String
        },
        dataNascimento:{
            type: Date
        },
        contatoUm:{
            type: String
        },
        contatoDois:{
            type: String
        }
    }, {
        collection: 'clienteEstabelecimento',
        timestamps: true
    }
);

exports.schemaClienteEstabelecimento =  conn.model('clienteEstabelecimento', ClienteEstabelecimentoSchema, 'clienteEstabelecimento');