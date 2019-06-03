const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');

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
            default: 'defaultIcon.png'
        },
        preco:{
            type:Number,
            default: 0
        },
        status:{
            type:Number,
            default: 0
        },
        quantidadeVendida:{
            type: Number,
            default: 0
        },
        hotSale:{
            type: Boolean,
            default: false
        },
        quantidadeDisponivel:{
            type: Number,
            default: 1
        },
        tempoDisponivel:{
            type:Date,
            required: true
        },
        estabelecimento:{
            type: Schema.Types.ObjectId,
            ref: 'estabelecimento'
        },
        produto:{
            type: Schema.Types.ObjectId,
            ref: 'produto'
        }
    }, {
        collection: 'itemLoja',
        timestamps: true
    }
);

exports.schemaItemLoja =  conn.model('itemLoja', ItemLojaSchema);
