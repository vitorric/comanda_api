const { Schema } = require('mongoose'),
    conn = require('../../../conn/index');

const EstabelecimentoUsuariosSchema = new Schema(
    {
        nome: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        status: {
            type: Number,
            default: 1
        },
        roles:{
            type: Schema.Types.ObjectId,
            ref: 'role'
        },
        estabelecimento:{
            type: Schema.Types.ObjectId,
            ref: 'estabelecimento'
        }
    }, {
        collection: 'estabelecimentoUsuarios',
        timestamps: true
    }
);

exports.schemaEstabelecimentoUsuarios =  conn.model('estabelecimentoUsuarios', EstabelecimentoUsuariosSchema);
