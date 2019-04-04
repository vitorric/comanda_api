const { Schema } = require('mongoose'),
    conn = require('../../../connection/index');

/**
 * @desc Definition of Avatar Schema
 * @name avatar
 * @memberof documents/Schema#
 * @property {string} email - Email is used as a login
 * @property {string} password - Password is used as a login
 * @property {boolean} status - Flag indicating whether the document is active or not
 * @property {string} nome - 
 * @property {string} apelido - 
 * @property {string} cpf - 
 * @property {date} dataNascimento - 
 * @property {Object} endereco - 
 * @property {ObjectId} avatar - 
*/
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
            ref: "role"
        },
        estabelecimento:{            
            type: Schema.Types.ObjectId,
            ref: "estabelecimento"
        }
    }, {
        collection: 'estabelecimentoUsuarios',
        timestamps: true
    }
);

exports.schemaEstabelecimentoUsuarios =  conn.model('estabelecimentoUsuarios', EstabelecimentoUsuariosSchema);
