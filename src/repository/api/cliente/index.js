const { schemaCliente } = require('../../../schema/api/cliente'),
    { cadastrarAvatar, obterAvatar, alterarAvatar } = require('../avatar'),
    { responseHandler, ObjectIdCast } = require('../../../utils'),
    JWT = require("jsonwebtoken"),
    {JWT_SECRET} = require("../../../../config");

signToken = cliente => {
    return "jwt " + JWT.sign({
        issuer: "Comanda", 
        cliente,
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
    },JWT_SECRET);
}


exports.cadastrarCliente = async (obj) => {
    
    let post = new schemaCliente(obj);

    let foundCliente = await schemaCliente.aggregate([
        { $match: { $or: [{ email: post.email }, { cpf: post.cpf }, {apelido: post.apelido}] } }
    ]).exec();

    if (foundCliente.length > 0){
        if (foundCliente[0].cpf === post.cpf)
            return {msg: 'REGISTRATION_ERROR_CPF'};
        else if (foundCliente[0].email === post.email)
            return {msg: 'REGISTRATION_ERROR_EMAIL'};
        else if (foundCliente[0].apelido === post.apelido)
            return {msg: 'REGISTRATION_ERROR_APELIDO'};
    }

    let novoAvatar = await cadastrarAvatar(JSON.parse(obj.avatar));  

    post.avatar = novoAvatar._id;

    return await post.save().then(() => {        
        // Generate the token
        const token = signToken(post);
        post.avatar = novoAvatar;
        // Respond with token
        return {token, user: post};
    
    }).catch(err => {
        throw responseHandler(err);
    });

};

exports.alterarConfigApp = async (obj) => {  
    const cliente = await schemaCliente.findById(obj._id);

    cliente.configApp = JSON.parse(obj.configApp);
    return await schemaCliente.findByIdAndUpdate(cliente._id, cliente).then(() => {        
        return {status: true, msg: "REGISTRO_ALTERADO"};
    }).catch(err => {
        throw responseHandler(err);
    });
};

exports.alterar = async (obj) => {  
    let cliente = await schemaCliente.findById(obj._id);

    cliente.endereco = JSON.parse(obj.endereco);
    return await alterarAvatar({avatar: obj.avatar}).then(async () => { 
        try {
            await schemaCliente.findByIdAndUpdate(cliente._id, cliente);
            return { status: true, msg: "REGISTRO_ALTERADO" };
        }
        catch (err) {
            throw responseHandler(err);
        }
    }).catch(err => {
        throw responseHandler(err);
    });
};

exports.loginCliente = async (cliente) => {
    
    cliente.avatar = await obterAvatar({_id: cliente.avatar});

    try {     
        const token = await signToken(cliente)
        return { token, user: cliente };
    } catch (error) {
        throw responseHandler(error);
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

            return {status: true, msg: "SENHA_RECUPERADA"};
        }
        
        return {status: false, msg: "NO_FOUND_USER"};
    } catch (error) {
        throw responseHandler(error);
    }
};

exports.listar = async () => {
    try {
        return await schemaCliente.find().select({ __v: 0 }).exec();
    } catch (error) {
        throw responseHandler(error);
    }
};

exports.comprarItemLoja = async (obj) => {

    const { schemaEstabelecimento } = require('../../../schema/api/estabelecimento');

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
        throw responseHandler(err);
    });

    return await schemaCliente.findByIdAndUpdate(cliente._id, cliente).then(() => {     
        
        const { schemaHistoricoCompraLojas } = require('../../../schema/api/historicoCompraLojas');

        let historicoCompra = new schemaHistoricoCompraLojas(obj);
        historicoCompra.itemLoja = idItemLoja;
        historicoCompra.precoItem = precoItem;
    
        //return historicoCompra.save();
        historicoCompra.save();
        
        return {status: true, msg: "ITEM_COMPRADO"};
    }).catch(err => {
        console.log(err)
        throw responseHandler(err);
    });            

};

exports.listarHistoricoCompra = async (query) => {
    try {
        const { schemaHistoricoCompraLojas } = require('../../../schema/api/historicoCompraLojas');
        return await schemaHistoricoCompraLojas.aggregate([
            {
                $match: 
                { 
                    cliente: ObjectIdCast(query.idCliente)						
                }
            },
            {
                $lookup:
                    {
                        from: "estabelecimento",
                        localField: "estabelecimento",
                        foreignField: "_id",
                        as: "estabelecimento"
                    }
            },
            { $unwind : { "path": "$estabelecimento" ,
            "preserveNullAndEmptyArrays": true} },  
            {
                $lookup:
                    {
                        from: "itemLoja",
                        localField: "itemLoja",
                        foreignField: "_id",
                        as: "itemLoja"
                    }
            },
            { $unwind : { "path": "$itemLoja" ,
            "preserveNullAndEmptyArrays": true} },
            { $project : { _id: 1, "estabelecimento.nome" : 1 , createdAt : 1, "itemLoja.nome": 1, precoItem: 1, "infoEntrega.jaEntregue": 1, "infoEntrega.dataEntrega": 1 } },
            { $sort : { createdAt: -1 } }
         ]);

    } catch (error) {
        throw responseHandler(error);
    }
};

exports.listarClienteConquistas = async (query) => {
    try {
        return await schemaCliente.aggregate([
            {
                $match: 
                { 
                    "conquistas.estabelecimento": ObjectIdCast(query.estabelecimento),
                    "_id": ObjectIdCast(query.cliente)
                }
            },
            {
                $project:{
                    "conquistas": 1
                }
            }    
        ]);

    } catch (error) {
        throw responseHandler(error);
    }
};

exports.entrarNoEstabelecimento = async (obj) => {    
    const { schemaEstabelecimento } = require('../../../schema/api/estabelecimento');
    const estabelecimento = await schemaEstabelecimento.findById(obj._idEstabelecimento);
    const cliente = await schemaCliente.findById(obj._idCliente);

    if (cliente.configClienteAtual.estaEmUmEstabelecimento)
        return {status: true, msg: "CLIENTE_JA_ESTA_NO_ESTABELECIMENTO_APP"};

    cliente.configClienteAtual.estaEmUmEstabelecimento = true;
    cliente.configClienteAtual.estabelecimento = estabelecimento._id;
    cliente.configClienteAtual.nomeEstabelecimento = estabelecimento.nome;

    if (estabelecimento.configEstabelecimentoAtual.estaAberta){
        
        return await schemaCliente.findByIdAndUpdate(cliente._id, cliente).then(() => {     
            estabelecimento.configEstabelecimentoAtual.clientesNoLocal.push(obj._idCliente);        
            return schemaEstabelecimento.findByIdAndUpdate(estabelecimento._id, estabelecimento).then(() => { 
                return {status: true, msg: "BEM_VINDO_CLIENTE", nomeEstabelecimento: estabelecimento.nome};
            }).catch(err => {
                throw responseHandler(err);
            });
        }).catch(err => {
            throw responseHandler(err);
        });
    }

    return {status: true, msg: "ESTABELECIMENTO_FECHADO"};
};

exports.sairDoEstabelecimento = async (obj) => {    
    const { schemaEstabelecimento } = require('../../../schema/api/estabelecimento');
    const estabelecimento = await schemaEstabelecimento.findById(obj._idEstabelecimento);
    const cliente = await schemaCliente.findById(obj._idCliente);

    cliente.configClienteAtual.estaEmUmEstabelecimento = false;
    cliente.configClienteAtual.estabelecimento = null;
    cliente.configClienteAtual.nomeEstabelecimento = null;
    
    return await schemaCliente.findByIdAndUpdate(cliente._id, cliente).then(() => {     

        const index = estabelecimento.configEstabelecimentoAtual.clientesNoLocal.indexOf(cliente._id);
        estabelecimento.configEstabelecimentoAtual.clientesNoLocal.splice(index,1);
     
        return schemaEstabelecimento.findByIdAndUpdate(estabelecimento._id, estabelecimento).then(() => { 
            return {status: true, msg: 'CLIENTE_SAIU'};
        }).catch(err => {
            throw responseHandler(err);
        });
    }).catch(err => {
        throw responseHandler(err);
    });
};