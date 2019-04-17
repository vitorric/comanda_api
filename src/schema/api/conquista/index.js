const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');

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
            default: 'defaultIcon.png'
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
                ref: 'produto'
            }
        },
        estabelecimento:{
            type: Schema.Types.ObjectId,
            ref: 'estabelecimento'
        }
    }, {
        collection: 'conquista',
        timestamps: true
    }
);

exports.schemaConquista =  conn.model('conquista', ConquistaSchema);
