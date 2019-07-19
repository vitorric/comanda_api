const { schemaDesafio } = require('../../../schema/api/desafio'),
    { ObjectIdCast} = require('../../../utils/index');

exports.cadastrarDesafio = async desafio => {
    try
    {
        let novoDesafio = new schemaDesafio(desafio);

        return await schemaDesafio.create(novoDesafio);
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in cadastrarDesafio:', error);
    }
};

exports.obterDesafio = async desafioId => {
    try {
        return schemaDesafio.findOne({
            _id: ObjectIdCast(desafioId),
            status: 1
        }).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in obterDesafio:', error);
    }
};

exports.listarDesafiosAtivos = async (produto, estabelecimento, estaEmGrupo) => {
    try {
        return await schemaDesafio.aggregate([
            {
                $match:
                {
                    $and :[{
                        $or: [{
                            $and : [ { 'objetivo.tipo': 'Produto', 'objetivo.produto': ObjectIdCast(produto)}]
                        },
                        {
                            'objetivo.tipo': 'Dinheiro'
                        }],
                        estabelecimento: ObjectIdCast(estabelecimento),
                        status: 1,
                        emGrupo: estaEmGrupo,
                        tempoDuracao: { $gte: new Date()}
                    }]
                }
            },
            {
                $project: {
                    premio:1,
                    estabelecimento: 1,
                    'objetivo.tipo': 1,
                    'objetivo.quantidade': 1
                }
            }]).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarDesafiosAtivos:', error);
    }
};