const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');

/*
statusFirebase:
0 = ainda nao foi pro firebase
1 = ja foi para o firebase
2 = ja saiu do firebase
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
            type:String
        },
        preco:{
            type:Number,
            default: 0
        },
        status:{
            type:Number,
            default: 0
        },
        statusFirebase: {
            type: Number,
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
        tempoEntrarNoAr:{
            type:Date,
            required: true
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
