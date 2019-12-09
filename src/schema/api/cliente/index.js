const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index'),
    bcrypt = require('bcryptjs');

const ClienteSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String
        },
        status: {
            type: Boolean,
            required: false,
            default: 1
        },
        chaveAmigavel: {
            type: Number,
            required: true,
            unique: true
        },
        nome:{
            type: String,
            required: true
        },
        apelido:{
            type: String,
            required: true
        },
        cpf:{
            type: String
        },
        dataNascimento:{
            type: Date
        },
        tipoLogin: {
            type: String
        },
        socialId: {
            type: String
        },
        sexo:{
            type: String,
            required: true
        },
        pontos:{
            type:Number,
            default:0
        },
        goldGeral:{
            type:Number,
            default:0
        },
        concluiuTutorialGeral: {
            type: Boolean,
            default: false
        },
        concluiuTutorialProfile: {
            type: Boolean,
            default: false
        },
        concluiuTutorialCorreio: {
            type: Boolean,
            default: false
        },
        concluiuTutorialDesafios: {
            type: Boolean,
            default: false
        },
        goldPorEstabelecimento:[{
            estabelecimento:{
                type: Schema.Types.ObjectId,
                ref: 'estabelecimento'
            },
            gold:{
                type:Number,
                default:0
            }
        }],
        configApp:{
            somFundo:{
                type:Number,
                required: false,
                default: 1
            },
            somGeral:{
                type:Number,
                required: false,
                default: 1
            }
        },
        configClienteAtual:{
            estaEmUmEstabelecimento:{
                type:Boolean,
                default:false
            },
            conviteEstabPendente: {
                type:Boolean,
                default:false
            },
            estabelecimento:{
                type: Schema.Types.ObjectId,
                ref: 'estabelecimento'
            },
            nomeEstabelecimento: {
                type: String
            },
            convitesComanda: [{
                liderComanda: {
                    type: Schema.Types.ObjectId,
                    ref: 'cliente'
                },
                comanda: {
                    type: Schema.Types.ObjectId,
                    ref: 'comanda'
                },
                dataConvite: {
                    type: Date,
                    required: true
                }
            }],
            comanda: {
                type: Schema.Types.ObjectId,
                ref: 'comanda'
            }
        },
        desafios:[{
            desafio:{
                type: Schema.Types.ObjectId,
                ref: 'desafio'
            },
            progresso:{
                type: Number,
                default: 0
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
        }],
        tokenFirebase: [{
            token: String,
            deviceId: String
        }],
        avatar: {
            type: Schema.Types.ObjectId,
            ref: 'avatar'
        }
    }, {
        collection: 'cliente',
        timestamps: true
    }
);

ClienteSchema.pre('save', async function(next){
    try {
        if (this.tipoLogin === 'normal') {
            // Generate a salt
            const salt = await bcrypt.genSalt(10);
            // Gerenate a password hash (salt + hash)
            const passwordHash = await bcrypt.hash(this.password, salt);
            //Re-assign hashed version over original, plain text password
            this.password = passwordHash;
        }
        next();
    }catch(error){
        next(error);
    }
});

ClienteSchema.methods.isValidPassword = async function(newPassword){
    try{
        return await bcrypt.compare(newPassword, this.password);
    }catch(error){
        throw new Error(error);
    }
};

exports.schemaCliente =  conn.model('cliente', ClienteSchema, 'cliente');