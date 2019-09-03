const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index'),
    bcrypt = require('bcryptjs');

const UserSchema = new Schema(
    {
        nome: {
            type: String,
            required: true
        },
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
    }, {
        collection: 'user',
        timestamps: true
    }
);

UserSchema.pre('save', async function(next){
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

UserSchema.methods.isValidPassword = async function(newPassword){
    try{
        return await bcrypt.compare(newPassword, this.password);
    }catch(error){
        throw new Error(error);
    }
};

exports.schemaUser =  conn.model('user', UserSchema);
