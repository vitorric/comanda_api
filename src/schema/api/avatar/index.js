const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');

const AvatarSchema = new Schema(
    {
        level: {
            type: Number,
            default: 1
        },
        exp: {
            type:Number,
            default: 0
        },
        expProximoLevel: {
            type:Number,
            default: 0
        },
        corpo: String,
        cabeca: String,
        nariz: String,
        olhos: String,
        boca: String,
        roupa: String,
        cabeloTraseiro: String,
        cabeloFrontal: String,
        barba: String,
        sombrancelhas: String,
        orelha: String,
        corPele: String,
        corCabelo: String,
        corBarba: String
    }, {
        collection: 'avatar',
        timestamps: true
    }
);

exports.avatarSchema =  conn.model('avatar', AvatarSchema);
