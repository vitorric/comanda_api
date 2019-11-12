const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');

const desafioClienteSchema = new Schema(
    {
        cliente:{
            type: Schema.Types.ObjectId,
            ref: 'cliente'
        },
        desafio:{
            type: Schema.Types.ObjectId,
            ref: 'desafio'
        },
        progresso:{
            type: Number,
            default: 0
        },
        premio:
        {
            tipo: {
                type: String
            },
            quantidade: {
                type:Number
            },
            produto:{
                type: Schema.Types.ObjectId,
                ref: 'produto'
            },
            ganhador: {
                type: Schema.Types.ObjectId,
                ref: 'cliente'
            }
        },
        estabelecimento:{
            type: Schema.Types.ObjectId,
            ref: 'estabelecimento'
        },
        resgatouPremio:{
            type: Boolean,
            default: false
        },
        concluido:{
            type:Boolean,
            default:false
        },
        dataConclusao: {
            type: Date
        },
        dataResgate: {
            type: Date
        }
    },
    {
        collection: 'desafioCliente',
        timestamps: true
    }
);

exports.schemaDesafioCliente =  conn.model('desafioCliente', desafioClienteSchema);
