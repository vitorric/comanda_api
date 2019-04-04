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
const RoleSchema = new Schema(
    {
        nome: {
            type: String,
            required: true
        },
        status: {
            type: Number,
            default: 1
        },
        modulos: [{
            nome: {
                type: String,
                default: '*'                
            },
            ler:{
                type: Boolean,
                default: true
            },  
            editar:{
                type: Boolean,
                default: true
            }, 
            criar:{
                type: Boolean,
                default: true
            }, 
            deletar:{
                type: Boolean,
                default: true
            }
        }]
    }, {
        collection: 'role',
        timestamps: true
    }
);

exports.schemaRole =  conn.model('role', RoleSchema);
