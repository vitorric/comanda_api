const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index'),
    bcrypt = require('bcryptjs');

const EstabelecimentoSchema = new Schema(
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
            default: 1
        },
        tipo:{
            type: String,
            required: true
        },
        nome:{
            type: String,
            required: true
        },
        icon:{
            type: String
        },
        descricao:{
            type: String
        },
        cnpj:{
            type: String,
            required: true,
            unique: true
        },
        horarioAtendimentoInicio:{
            type: String,
            required: true
        },
        horarioAtendimentoFim:{
            type: String,
            required: true
        },
        telefone:{
            type: String
        },
        celular:{
            type: String
        },
        emailContato:{
            type: String
        },
        coordenadas: {
            lat:{
                type: String
            },
            long: {
                type: String
            }
        },
        endereco:{
            rua:{
                type: String,
                required: true
            },
            numero:{
                type: Number,
                required: true
            },
            bairro:{
                type: String,
                required: true
            },
            cidade:{
                type: String,
                required: true
            },
            cep:{
                type: String,
                required: true
            },
            estado:{
                type: String,
                required: true
            }
        },
        configEstabelecimentoAtual:{
            estaAberta:{
                type:Boolean,
                default:false
            },
            clientesNoLocal:[{
                type: Schema.Types.ObjectId,
                ref: 'cliente'
            }]
        },
        desafios:[{
            type: Schema.Types.ObjectId,
            ref: 'desafio'
        }],
        produtos:[{
            type: Schema.Types.ObjectId,
            ref: 'produto'
        }],
        itensLoja:[{
            item:{
                type: Schema.Types.ObjectId,
                ref: 'itemLoja'
            }
        }],
        roles:[{
            type: Schema.Types.ObjectId,
            ref: 'role'
        }],
        estabelecimentoUsuarios: [{
            type: Schema.Types.ObjectId,
            ref: 'estabelecimentoUsuario'
        }]
    }, {
        collection: 'estabelecimento',
        timestamps: true
    }
);

EstabelecimentoSchema.pre('save', async function(next){
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

EstabelecimentoSchema.methods.isValidPassword = async function(newPassword){
    try{
        return await bcrypt.compare(newPassword, this.password);
    }catch(error){
        throw new Error(error);
    }
};

EstabelecimentoSchema.methods.recuperarSenha = async function(){
    try{
        var randPassword = Array(10).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz').map(function(x) { return x[Math.floor(Math.random() * x.length)]; }).join('');

        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Gerenate a password hash (salt + hash)
        const passwordHash = await bcrypt.hash(randPassword, salt);
        this.password = passwordHash;

        return randPassword;
    }catch(error){
        throw new Error(error);
    }
};


exports.schemaEstabelecimento =  conn.model('estabelecimento', EstabelecimentoSchema);
