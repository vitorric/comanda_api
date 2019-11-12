const { schemaToken } = require('../../../schema/api/token');

exports.cadastrarToken = async token => {
    try
    {
        let novoToken = new schemaToken(token);

        return await schemaToken.create(novoToken);
    }
    catch(error){
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarToken:', error);
    }
};

exports.obterToken = async (email, token) => {
    try {
        return schemaToken.findOne({
            email: email,
            token: token
        }).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterToken:', error);
    }
};

exports.excluirToken = async (email, token) => {
    try {
        return schemaToken.findOneAndRemove({
            email: email,
            token: token
        }).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in excluirToken:', error);
    }
};