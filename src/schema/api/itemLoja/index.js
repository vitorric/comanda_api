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
        estabelecimento:{
            type: Schema.Types.ObjectId,
            ref: 'estabelecimento'
        },
        produtoRef:{
            type: Schema.Types.ObjectId,
            ref: 'produto'
        }
    }, {
        collection: 'itemLoja',
        timestamps: true
    }
);

exports.schemaItemLoja =  conn.model('itemLoja', ItemLojaSchema);
