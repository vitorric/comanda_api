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
const HistoricoCompraLojas = new Schema(
{
    cliente:{
        type: Schema.Types.ObjectId,
        ref: "cliente"
    },
    estabelecimento:{
        type: Schema.Types.ObjectId,
        ref: "estabelecimento"
    },
    itemLoja:{
        type: Schema.Types.ObjectId,
        ref: "itemLoja"
    },
    precoItem:{
        type: Number,
        required: true
    },
    infoEntrega: {
        jaEntregue:{
            type:Boolean,
            default: false
        },
        dataEntrega:{
            type: Date
        }        
    }
}, {
    collection: 'historicoCompraLojas',
    timestamps: true
}
);

exports.schemaHistoricoCompraLojas =  conn.model('historicoCompraLojas', HistoricoCompraLojas);
