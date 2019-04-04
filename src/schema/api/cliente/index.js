const { Schema } = require('mongoose'),
    conn = require('../../../connection/index'),
    bcrypt = require("bcryptjs");

/**
 * @desc Definition of Profile Schema
 * @name cliente
 * @memberof documents/Schema#
 * @property {string} email - Email is used as a login
 * @property {string} password - Password is used as a login
 * @property {boolean} status - Flag indicating whether the document is active or not
 * @property {string} nome - 
 * @property {string} apelido - 
 * @property {string} cpf - 
 * @property {date} dataNascimento - 
 * @property {Object} endereco - 
 * @property {ObjectId} avatar - 
*/
const ClienteSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            required: false,
            default: 1
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
            type: String,
            unique: true,
            required: true
        },
        dataNascimento:{
            type: Date,
            required: true
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
        goldPorEstabelecimento:[{
            estabelecimento:{                
                type: Schema.Types.ObjectId,
                ref: "estabelecimento"
            },
            gold:{
                type:Number,
                default:0
            }
        }],
        endereco:{
            rua:{
                type: String
            },
            numero:{
                type: Number
            },
            bairro:{
                type: String
            },
            cidade:{
                type: String
            },
            cep:{
                type: String
            },
            estado:{
                type: String
            }
        },
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
            estabelecimento:{
                type: Schema.Types.ObjectId,
                ref: "estabelecimento"
            },
            nomeEstabelecimento: {
                type: String
            }, 
            comanda: {
                type: Schema.Types.ObjectId,
                ref: "comanda"
            }
        },
        conquistas:[{
            conquista:{
                type: Schema.Types.ObjectId,
                ref: "conquista"
            },
            quantidadeParaObter:{
                type: Number,
                default: 0
            },
            estabelecimento:{
                type: Schema.Types.ObjectId,
                ref: "estabelecimento"
            },
            concluido:{
                type:Boolean,
                default:false
            },
            dataConclusao: {
                type: Date
            }
        }],
        avatar: {
            type: Schema.Types.ObjectId,
            ref: "avatar"
        }
    }, {
        collection: 'cliente',
        timestamps: true
    }
);

ClienteSchema.pre("save", async function(next){
    try{
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Gerenate a password hash (salt + hash)
        const passwordHash = await bcrypt.hash(this.password, salt);
        //Re-assign hashed version over original, plain text password
        this.password = passwordHash;
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
}

ClienteSchema.methods.recuperarSenha = async function(){
    try{
        var randPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');

        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Gerenate a password hash (salt + hash)
        const passwordHash = await bcrypt.hash(randPassword, salt);      
        this.password = passwordHash;

        return randPassword;
    }catch(error){
        throw new Error(error);
    }
}

ClienteSchema.methods.diminuirDinheiroNoEstabelecimento = function(objIdEstabelecimento, precoItem){
    
    this.goldPorEstabelecimento.map(function(value) {        
        if (value.estabelecimento == objIdEstabelecimento){
            value.gold -= precoItem;
        }
    });
}

exports.schemaCliente =  conn.model('cliente', ClienteSchema);
