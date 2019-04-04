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
const ProdutoSchema = new Schema(
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
        custo: {
            type: Number
        },
        estoque: {
            type: Number,
            default: 0
        },
        preco:{
            type:Number,
            default: 0
        },
        estabelecimento:{
            type: Schema.Types.ObjectId,
            ref: "estabelecimento"
        },
        status:{            
            type:Number, 
            default: 0
        }
    }, {
        collection: 'produto',
        timestamps: true
    }
);

exports.schemaProduto =  conn.model('produto', ProdutoSchema);
