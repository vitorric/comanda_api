const { Schema } = require('mongoose'),
    conn = require('../../../conn/mongo/index');

const TokenSchema = new Schema(
    {
        token: {
            type: String,
            required: true
        },
        cliente:{
            type: Schema.Types.ObjectId,
            ref: 'cliente'
        },
        email: {
            type: String,
            required: true
        },
        tipo: {
            type: String,
            required: true
        },
        status: {
            type: Number,
            default: 1
        }
    }, {
        collection: 'token',
        timestamps: true
    }
);

exports.schemaToken =  conn.model('token', TokenSchema);