const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');

const HistoricoComanda = new Schema(
    {
        comanda:{
            type: Schema.Types.ObjectId,
            ref: 'comanda'
        },
        estabelecimento:{
            type: Schema.Types.ObjectId,
            ref: 'estabelecimento'
        },
        nomeProduto: {
            type: String
        },
        iconProduto: {
            type: String
        },
        quantidade: {
            type: Number
        },
        valorTotal: {
            type: Number
        }
    }, {
        collection: 'historicoComanda',
        timestamps: true
    }
);

exports.schemaHistoricoComanda =  conn.model('historicoComanda', HistoricoComanda);
