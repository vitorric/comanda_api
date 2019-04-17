const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');

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
