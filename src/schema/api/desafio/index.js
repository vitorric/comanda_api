const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');

const DesafioSchema = new Schema(
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
        emGrupo:{
            type: Boolean,
            default: false
        },
        premio:
        {
            tipo: {
                type: String,
                required: true
            },
            quantidade: {
                type:Number,
                required: true
            },
            produto:{
                type: Schema.Types.ObjectId,
                ref: 'produto'
            }
        },
        tempoDuracao:{
            type:Date,
            required: true
        },
        status:{
            type:Number,
            default: 1
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
        collection: 'desafio',
        timestamps: true
    }
);

exports.schemaDesafio =  conn.model('desafio', DesafioSchema);
