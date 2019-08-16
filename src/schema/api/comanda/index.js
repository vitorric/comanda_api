const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');


const ComandaSchema = new Schema(
    {
        dataSaida:{
            type: Date
        },
        status:
        {
            type:Number,
            default: 0
        },
        aberta: {
            type: Boolean,
            default: true
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
            lider: {
                type: Boolean,
                default: false
            },
            valorPago:{
                type: Number,
                default: 0
            },
            jaPagou:{
                type: Boolean,
                default: false
            },
            avatarAlterado: {
                type: Date,
                default: Date.now()
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
