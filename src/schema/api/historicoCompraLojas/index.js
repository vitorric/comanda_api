const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');

const HistoricoCompraLojas = new Schema(
    {
        cliente:{
            type: Schema.Types.ObjectId,
            ref: 'cliente'
        },
        estabelecimento:{
            type: Schema.Types.ObjectId,
            ref: 'estabelecimento'
        },
        itemLoja:{
            type: Schema.Types.ObjectId,
            ref: 'itemLoja'
        },
        chaveUnica:{
            type: String,
            unique: true,
            required: true
        },
        precoItem:{
            type: Number,
            required: true
        },
        infoEntrega: {
            jaEntregue:{
                type:Boolean,
                default: false
            },
            dataEntrega:{
                type: Date
            }
        }
    }, {
        collection: 'historicoCompraLojas',
        timestamps: true
    }
);

exports.schemaHistoricoCompraLojas =  conn.model('historicoCompraLojas', HistoricoCompraLojas);
