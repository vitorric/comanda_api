const { schemaRole } = require('../../../schema/api/role');

exports.cadastrarRole = async (nome) => {
    try
    {
        let novaRole = new schemaRole();

        novaRole.nome = nome;

        return await schemaRole.create(novaRole);
    }
    catch(error){
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarRole:', error);
    }
};