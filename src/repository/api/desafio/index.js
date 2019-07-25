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

exports.listarDesafiosEstab = async estabelecimentoId => {
    try {
        return await schemaDesafio.aggregate([
            {
                $match: {
                    estabelecimento: ObjectIdCast(estabelecimentoId)
                }
            },
            {
                $lookup:
                    {
                        from: 'produto',
                        localField: 'objetivo.produto',
                        foreignField: '_id',
                        as: 'objetivo.produto'
                    }
            },
            { $unwind : { 'path': '$objetivo.produto' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $lookup:
                        {
                            from: 'produto',
                            localField: 'premio.produto',
                            foreignField: '_id',
                            as: 'premio.produto'
                        }
            },
            { $unwind : { 'path': '$premio.produto' ,
                'preserveNullAndEmptyArrays': true} },{
                $project:
                {
                    nome: 1,
                    tempoDuracao: { $dateToString: { format: '%d/%m/%Y %H:%m', date: '$tempoDuracao' } },
                    emGrupo: 1,
                    status: 1,
                    'objetivo.tipo': 1,
                    'objetivo.quantidade': 1,
                    'objetivo.produto.nome': 1,
                    'premio.quantidade': 1,
                    'premio.tipo': 1,
                    'premio.produto.nome': 1
                }
            }]).exec();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarDesafiosEstab:', error);
    }
};

exports.obterDesafioEstab = async (estabelecimentoId, desafioId) => {
    try {
        return await schemaDesafio.aggregate([
            {
                $match: {
                    estabelecimento: ObjectIdCast(estabelecimentoId),
                    _id: ObjectIdCast(desafioId)
                }
            },
            {
                $lookup:
                    {
                        from: 'produto',
                        localField: 'objetivo.produto',
                        foreignField: '_id',
                        as: 'objetivo.produto'
                    }
            },
            { $unwind : { 'path': '$objetivo.produto' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $lookup:
                        {
                            from: 'produto',
                            localField: 'premio.produto',
                            foreignField: '_id',
                            as: 'premio.produto'
                        }
            },
            { $unwind : { 'path': '$premio.produto' ,
                'preserveNullAndEmptyArrays': true} },{
                $project:
                {
                    nome: 1,
                    tempoDuracao: 1,
                    emGrupo: 1,
                    descricao: 1,
                    status: 1,
                    'objetivo.tipo': 1,
                    'objetivo.quantidade': 1,
                    'objetivo.produto.codigo': 1,
                    'objetivo.produto.nome': 1,
                    'premio.quantidade': 1,
                    'premio.tipo': 1,
                    'premio.produto.codigo': 1,
                    'premio.produto.nome': 1
                }
            }]).exec().then(items => items[0]);
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in listarDesafiosEstab:', error);
    }
};

exports.alterarDesafioEstab = async (desafioId, desafio) => {

    try {

        let desafioAlterado = await schemaDesafio.findOneAndUpdate(
            {
                _id: ObjectIdCast(desafioId)
            },
            {
                $set: {
                    nome: desafio.nome,
                    descricao: desafio.descricao,
                    status: desafio.status,
                    tempoDuracao: desafio.tempoDuracao,
                    icon: desafio.icon
                }

            }).exec();

        if (!desafioAlterado){
            return false;
        }

        return true;
    }
    catch(error)
    {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in alterarAvatar:', error);
    }
};