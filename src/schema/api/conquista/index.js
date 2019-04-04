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
const ConquistaSchema = new Schema(
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
        premio:{
            type:Number,
            default: 0
        },
        tempoDuracao:{
            type:Date,
            required: true
        },
        status:{            
            type:Number, 
            default: 0
        },
        objetivo:{
            //os tipos iniciais serao gastar dinheiro ou comprar produtos
            tipo:{
                type: String,
                required: true
            },
            quantidade:{
                type: Number,
                required: true
            },
            produto:{
                type: Schema.Types.ObjectId,
                ref: "produto"
            }
        },
        estabelecimento:{
            type: Schema.Types.ObjectId,
            ref: "estabelecimento"
        }
    }, {
        collection: 'conquista',
        timestamps: true
    }
);

exports.schemaConquista =  conn.model('conquista', ConquistaSchema);
