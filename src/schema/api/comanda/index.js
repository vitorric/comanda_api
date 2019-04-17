const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');


const ComandaSchema = new Schema(
    {
        dataEntrada:{
            type:Date,
            required: true
        },
        dataSaida:{
            type: Date
        },
        status:{
            type:Number,
            default: 0
        },
        estabelecimento:{
            type: Schema.Types.ObjectId,
            ref: 'estabelecimento'
        },
        valorTotal:{
            type: Number,
            default: 0
        },
        grupo:[{
            cliente:{
                type: Schema.Types.ObjectId,
                ref: 'cliente'
            },
            valorPago:{
                type: Number,
                default: 0
            }
        }],
        produtos:[{
            preco:{
                type: Number,
                required: true
            },
            quantidade:{
                type: Number,
                default: 1
            },
            produto:{
                type: Schema.Types.ObjectId,
                ref: 'produto'
            },
            precoTotal:{
                type:Number,
                required: true
            }
        }]
    }, {
        collection: 'comanda',
        timestamps: true
    }
);

exports.schemaComanda =  conn.model('comanda', ComandaSchema);
