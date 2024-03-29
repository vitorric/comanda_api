const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');

const ProdutoSchema = new Schema(
    {
        codigo: {
            type: Number,
            required: true
        },
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
        custo: {
            type: Number,
            default: 0
        },
        estoque: {
            type: Number,
            default: 0
        },
        quantidadeVendida: {
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
