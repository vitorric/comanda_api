const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');

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
            default: 'defaultIcon.png'
        },
        custo: {
            type: Number,
            default: 0
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
            ref: 'estabelecimento'
        },
        status:{
            type:Number,
            default: 1
        }
    }, {
        collection: 'produto',
        timestamps: true
    }
);

exports.schemaProduto =  conn.model('produto', ProdutoSchema);
