/* eslint-disable no-undef */
const { schemaCliente } = require('../../../schema/api/cliente'),
    { alterarAvatar } = require('../avatar'),
    { ObjectIdCast } = require('../../../utils'),
    { schemaEstabelecimento } = require('../../../schema/api/estabelecimento'),
    { schemaHistoricoCompraLojas } = require('../../../schema/api/historicoCompraLojas'),
    firebaseCliente = require('../../../service/firebase/cliente');

exports.cadastrarCliente = async (cliente) => {
    try
    {
        let novoCliente = new schemaCliente(cliente);

        return await schemaCliente.create(novoCliente).catch(err => {
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

exports.obterClienteParaCadastro = async( email, apelido) => {
    try {
        return await schemaCliente.aggregate([
            { $match: { $or: [{ email: email }, {apelido: apelido}] } }
        ]).exec().then(items => items[0]);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.obterCliente = async (idCliente) => {
    try {
        return await schemaCliente.aggregate([
            {
                $match: {
                    _id: idCliente
                }
            },
            {
                $lookup: {
                    from: 'avatar',
                    let: { avatarID: '$avatar' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ '$_id', '$$avatarID'],
                                }
                            }
                        },
                        {
                            $project: {
                                _id: {
                                    $toString: '$_id'
                                },
                                level:1,
                                exp:1,
                                corpo: 1,
                                cabeca: 1,
                                nariz: 1,
                                olhos: 1,
                                boca: 1,
                                roupa: 1,
                                cabeloTraseiro: 1,
                                cabeloFrontal: 1,
                                barba: 1,
                                sombrancelhas: 1,
                                orelha: 1,
                                corPele: 1,
                                corCabelo: 1,
                                corBarba: 1
                            }
                        }

                    ],
                    as: 'avatar'
                }
            },
            { $unwind : { 'path': '$avatar' , 'preserveNullAndEmptyArrays': true} },
            {
                $project: {
                    _id: {
                        $toString: '$_id'
                    },
                    apelido: 1,
                    sexo: 1,
                    cpf: 1,
                    nome: 1,
                    status: 1,
                    goldGeral: 1,
                    dataNascimento: { $dateToString: { format: '%Y-%m-%d', date: '$dataNascimento' } },
                    avatar: 1,
                    configApp: 1,
                    configClienteAtual: 1
                }
            }
        ]).exec().then(items => items[0]);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

//----------------------------------------------------------------------

exports.alterarClienteConfigApp = async (idCliente, somFundo, somGeral) => {

    try
    {
        let clienteAlterado = schemaCliente.findOneAndUpdate(
            {
                _id: ObjectIdCast(idCliente)
            },
            {
                $set: {
                    'configApp.somFundo': somFundo,
                    'configApp.somGeral': somGeral
                }
            })
            .exec();

        if (!clienteAlterado){
            return false;
        }

        return true;
    }
    catch(error)
    {
        console.log('Error alterarAvatar: ', error);
        throw error;
    }

    // cliente.configApp = JSON.parse(obj.configApp);
    // return await schemaCliente.findByIdAndUpdate(cliente._id, cliente).then(() => {
    //     return false;
    // }).catch(err => {
    //     throw err;
    // });
};

exports.alterar = async (obj) => {
    let cliente = await schemaCliente.findById(obj._id);

    cliente.endereco = JSON.parse(obj.endereco);
    return await alterarAvatar({avatar: obj.avatar}).then(async () => {
        try {
            await schemaCliente.findByIdAndUpdate(cliente._id, cliente);
            return { status: true, msg: 'REGISTRO_ALTERADO' };
        }
        catch (err) {
            throw err;
        }
    }).catch(err => {
        throw err;
    });
};

exports.loginCliente = async (cliente) => {
    try {
        const token = await signToken({ _id: cliente._id });
        return { token, _id: cliente._id };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

exports.recuperarSenha = async (obj) => {

    try {
        let foundCliente = await schemaCliente.findOne({email:obj.email}).select({ __v: 0 });

        if (foundCliente){
            const novaSenha = await foundCliente.recuperarSenha();

            await schemaCliente.findByIdAndUpdate(foundCliente._id, foundCliente, () => {
                require('../../../service/email')(foundCliente, novaSenha);
            });

            return {status: true, msg: 'SENHA_RECUPERADA'};
        }

        return {status: false, msg: 'NO_FOUND_USER'};
    } catch (error) {
        throw error;
    }
};

exports.listar = async () => {
    try {
        return await schemaCliente.find().select({ __v: 0 }).exec();
    } catch (error) {
        throw error;
    }
};

exports.comprarItemLoja = async (obj) => {
    const cliente = await schemaCliente.findById(ObjectIdCast(obj.cliente));

    const estabelecimento = await schemaEstabelecimento.findById(ObjectIdCast(obj.estabelecimento));
    let estabelecimentoItem;

    estabelecimento.itensLoja.map(function(value)
    {
        if (value._id == obj.itemLoja){
            estabelecimentoItem = value;
        }
    }
    );

    if (estabelecimentoItem.quantidadeDisponivel <= 0)
        return {msg: 'ITEM_LOJA_SEM_ESTOQUE', status: true};
    else if (new Date(estabelecimentoItem.tempoDisponivel) < new Date())
        return {msg: 'ITEM_LOJA_TEMPO_EXPIRADO', status: true};

    estabelecimentoItem.quantidadeDisponivel -= 1;
    estabelecimentoItem.quantidadeVendida += 1;

    const { schemaItemLoja } = require('../../../schema/api/itemLoja');

    await schemaEstabelecimento.findByIdAndUpdate(estabelecimento._id, estabelecimento);
    let idItemLoja;
    let precoItem;
    await schemaItemLoja.findById(ObjectIdCast(estabelecimentoItem.item)).then((item) => {
        cliente.diminuirDinheiroNoEstabelecimento(obj.estabelecimento, item.preco);
        idItemLoja = item._id;
        precoItem = item.preco;
    }).catch(err => {
        throw err;
    });

    return await schemaCliente.findByIdAndUpdate(cliente._id, cliente).then(() => {
        let historicoCompra = new schemaHistoricoCompraLojas(obj);
        historicoCompra.itemLoja = idItemLoja;
        historicoCompra.precoItem = precoItem;

        //return historicoCompra.save();
        historicoCompra.save();

        return {status: true, msg: 'ITEM_COMPRADO'};
    }).catch(err => {
        console.log(err);
        throw err;
    });

};

exports.listarHistoricoCompra = async (query) => {
    try {
        return await schemaHistoricoCompraLojas.aggregate([
            {
                $match:
                {
                    cliente: ObjectIdCast(query._idCliente)
                }
            },
            {
                $lookup:
                    {
                        from: 'estabelecimento',
                        localField: 'estabelecimento',
                        foreignField: '_id',
                        as: 'estabelecimento'
                    }
            },
            { $unwind : { 'path': '$estabelecimento' ,
                'preserveNullAndEmptyArrays': true} },
            {
                $lookup:
                    {
                        from: 'itemLoja',
                        localField: 'itemLoja',
                        foreignField: '_id',
                        as: 'itemLoja'
                    }
            },
            { $unwind : { 'path': '$itemLoja' ,
                'preserveNullAndEmptyArrays': true} },
            { $project : { _id: 1, 'estabelecimento.nome' : 1 , createdAt : 1, 'itemLoja.nome': 1, precoItem: 1, 'infoEntrega.jaEntregue': 1, 'infoEntrega.dataEntrega': 1 } },
            { $sort : { createdAt: -1 } }
        ]);

    } catch (error) {
        throw error;
    }
};

exports.listarClienteConquistas = async (query) => {
    try {
        return await schemaCliente.aggregate([
            {
                $match:
                {
                    'conquistas.estabelecimento': ObjectIdCast(query._idEstabelecimento),
                    '_id': ObjectIdCast(query._idCliente)
                }
            },
            {
                $project:{
                    'conquistas': 1
                }
            }
        ]);

    } catch (error) {
        throw error;
    }
};

exports.entrarNoEstabelecimento = async (obj) => {

    const estabelecimento = await schemaEstabelecimento.findById(obj._idEstabelecimento);

    if (estabelecimento.configEstabelecimentoAtual.estaAberta) {

        const cliente = await schemaCliente.findById(obj._idCliente);

        console.log(cliente.configClienteAtual.estaEmUmEstabelecimento);

        if (cliente.configClienteAtual.estaEmUmEstabelecimento)
            return {status: false, msg: 'CLIENTE_JA_ESTA_NO_ESTABELECIMENTO_APP'};

        cliente.configClienteAtual.estaEmUmEstabelecimento = true;
        cliente.configClienteAtual.estabelecimento = estabelecimento._id;
        cliente.configClienteAtual.nomeEstabelecimento = estabelecimento.nome;
        cliente.configClienteAtual.conviteEstabPendente = false;

        return await schemaCliente.findByIdAndUpdate(cliente._id, cliente).then(async () => {
            estabelecimento.configEstabelecimentoAtual.clientesNoLocal.push(obj._idCliente);
            try {
                schemaEstabelecimento.findByIdAndUpdate(estabelecimento._id, estabelecimento);
                await firebaseCliente.EntrarNoEstabelecimento(obj._idCliente, obj._idEstabelecimento, estabelecimento.nome).then(() => {
                    return { status: true, msg: 'BEM_VINDO_CLIENTE', nomeEstabelecimento: estabelecimento.nome };
                });
            }
            catch (err) {
                throw err;
            }
        }).catch(err => {
            throw err;
        });
    }

    return {status: true, msg: 'ESTABELECIMENTO_FECHADO'};
};

exports.sairDoEstabelecimento = async (obj) => {
    const estabelecimento = await schemaEstabelecimento.findById(obj._idEstabelecimento);
    const cliente = await schemaCliente.findById(obj._idCliente);

    cliente.configClienteAtual.estaEmUmEstabelecimento = false;
    cliente.configClienteAtual.estabelecimento = null;
    cliente.configClienteAtual.nomeEstabelecimento = null;

    return await schemaCliente.findByIdAndUpdate(cliente._id, cliente).then(() => {

        const index = estabelecimento.configEstabelecimentoAtual.clientesNoLocal.indexOf(cliente._id);
        estabelecimento.configEstabelecimentoAtual.clientesNoLocal.splice(index,1);

        return schemaEstabelecimento.findByIdAndUpdate(estabelecimento._id, estabelecimento).then(() => {

            return firebaseCliente.RecusarSairDoEstabelecimento(cliente._id).then((res) => {
                console.log(res);
                return {status: true, msg: 'CLIENTE_SAIU'};
            });
        }).catch(err => {
            throw err;
        });
    }).catch(err => {
        throw err;
    });
};

exports.recusarConviteEstabelecimento = async (obj) => {
    const cliente = await schemaCliente.findById(obj._idCliente);

    cliente.configClienteAtual.estaEmUmEstabelecimento = false;
    cliente.configClienteAtual.estabelecimento = null;
    cliente.configClienteAtual.nomeEstabelecimento = null;
    cliente.configClienteAtual.conviteEstabPendente = false;

    return await schemaCliente.findByIdAndUpdate(cliente._id, cliente).then(async () => {

        return await firebaseCliente.RecusarSairDoEstabelecimento(cliente._id).then((res) => {
            console.log(res);
            return { status: true, msg: 'CLIENTE_RECUSOU_CONVITE' };
        });

    }).catch(err => {
        throw err;
    });
};