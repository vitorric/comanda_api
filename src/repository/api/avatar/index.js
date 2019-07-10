const { avatarSchema } = require('../../../schema/api/avatar'),
    { ObjectIdCast } = require('../../../utils');


exports.cadastrarAvatar = async avatar => {
    try
    {
        let novoAvatar = new avatarSchema(avatar);

        return await avatarSchema.create(novoAvatar);
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro em cadastrarAvatar:', error);
    }
};

exports.obterAvatar = (avatarId) => {
    try
    {
        return avatarSchema.findOne(
            {
                _id: ObjectIdCast(avatarId)
            }).exec();
    }
    catch (error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterAvatar:', error);
    }
};

exports.alterarAvatar = async (avatarId, avatar) => {
    try
    {
        let avatarAlterado = await avatarSchema.findOneAndUpdate(
            {
                _id: ObjectIdCast(avatarId)
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

            }).exec();

        if (!avatarAlterado){
            return false;
        }

        return true;
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarAvatar:', error);
    }

};


exports.alterarExp = (avatarId, exp, expProximoLevel, level) => {

    try
    {
        let avatarAlterado = avatarSchema.findOneAndUpdate(
            {
                _id: ObjectIdCast(avatarId)
            },
            {
                $set: {
                    exp: exp,
                    expProximoLevel: expProximoLevel,
                    level: level
                }

            }).exec();

        if (!avatarAlterado){
            return false;
        }

        return true;
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarExp:', error);
    }

};