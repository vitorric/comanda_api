const { avatarSchema } = require('../../../schema/api/avatar'),
    { ObjectIdCast } = require('../../../utils');


exports.cadastrarAvatar = async (avatar) => {
    try
    {
        let novoAvatar = new avatarSchema(avatar);

        return await avatarSchema.create(novoAvatar).catch(err => {
            console.log(err);
            throw err;
        });
    }
    catch(error)
    {
        console.log(error);
        throw error;
    }
};

exports.obterAvatar = async (_id) => {
    try
    {
        return await avatarSchema.findOne(
            {
                _id: ObjectIdCast(_id)
            });
    }
    catch (error)
    {
        console.log(error);
        throw error;
    }
};

exports.alterarAvatar = (avatar) => {
    try
    {
        let avatarAlterado = avatarSchema.findOneAndUpdate(
            {
                _id: ObjectIdCast(avatar._idCliente)
            },
            {
                $set: {
                    corpo: avatar.corpo,
                    cabeca: avatar.cabeca,
                    nariz: avatar.nariz,
                    olhos: avatar.olhos,
                    boca: avatar.boca,
                    roupa: avatar.roupa,
                    cabeloTraseiro: avatar.cabeloTraseiro,
                    cabeloFrontal: avatar.cabeloFrontal,
                    barba: avatar.barba,
                    sombrancelhas: avatar.sombrancelhas,
                    orelha: avatar.orelha,
                    corPele: avatar.corPele,
                    corCabelo: avatar.corCabelo,
                    corBarba: avatar.corBarba
                }

            })
            .exec();

        if (!avatarAlterado){
            return false;
        }

        return true;
    }
    catch(error)
    {
        console.log('Error alterarAvatar: ', error);
        throw error;
    }

};


exports.alterarExp = async (avatarId, exp, level) => {

    try
    {
        let avatarAlterado = avatarSchema.findOneAndUpdate(
            {
                _id: ObjectIdCast(avatarId)
            },
            {
                $set: {
                    exp: exp,
                    level: level
                }

            })
            .exec();

        if (!avatarAlterado){
            return false;
        }

        return true;
    }
    catch(error)
    {
        console.log('Error alterarAvatar: ', error);
        throw error;
    }

};