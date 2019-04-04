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
const ItemLojaSchema = new Schema(
    {
        nome: {
            type: String,
            required: true
        },
        descricao:{
            type: String            
        },
        icon:{
            type:String,
            default: "defaultIcon.png"
        },
        preco:{
            type:Number,
            default: 0
        },
        status:{            
            type:Number, 
            default: 0
        },
        estabelecimento:{
            type: Schema.Types.ObjectId,
            ref: "estabelecimento"
        },
        produtoRef:{
            type: Schema.Types.ObjectId,
            ref: "produto"
        }
    }, {
        collection: 'itemLoja',
        timestamps: true
    }
);

exports.schemaItemLoja =  conn.model('itemLoja', ItemLojaSchema);
