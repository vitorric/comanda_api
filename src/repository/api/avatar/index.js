const { schemaAvatar } = require('../../../schema/api/avatar'),
    { responseHandler } = require('../../../utils');


exports.cadastrarAvatar = async (obj) => {

    try{
        let post = new schemaAvatar(obj);
        return await post.save().then(() => {
            return post;
        }).catch(error => {
            console.log(error);
            throw responseHandler(error);
        });
    }catch(error){
        console.log(error);
        throw responseHandler(error);
    }
};

exports.obterAvatar = async (obj) => {
    try {
        return await schemaAvatar.findById(obj._id);
    } catch (error) {
        console.log(error);
        throw responseHandler(error);
    }
};

exports.alterarAvatar = async (obj) => {

    const avatar = new schemaAvatar(JSON.parse(obj.avatar));

    return await schemaAvatar.findByIdAndUpdate(avatar._id, avatar).then(() => {
        return {status: true, msg: 'AVATAR_ALTERADO'};
    }).catch(err => {
        console.log(err);
        throw responseHandler(err);
    });
};