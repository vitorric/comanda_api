const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');

//os tipos da comanda podem ser:
//ConviteGrupo
//ConviteAmizade
//Premiacao (dinheiro,exp,pontos)
const correioSchema = new Schema(
    {
        cliente:{
            type: Schema.Types.ObjectId,
            ref: 'cliente'
        },
        correio: [{
            titulo:{
                type: String,
                required: true
            },
            mensagem:{
                type: String,
                required: true
            },
            mensagemGrande: String,
            dataCriacao: Date,
            lida: {
                type: Boolean,
                default: false
            },
            acao: {
                tipo: String,
                executouAcao: {
                    type: Boolean,
                    default: false
                },
                comanda: Schema.Types.ObjectId,
                cliente: Schema.Types.ObjectId,
                dinheiro: Number,
                exp: Number,
                pontos: Number
            },
            status:{
                type: Boolean,
                default: true
            }
        }]
    },
    {
        collection: 'correio',
        timestamps: true
    }
);

exports.schemaCorreio =  conn.model('correio', correioSchema);
