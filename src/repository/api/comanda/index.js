const { schemaComanda } = require('../../../schema/api/comanda'),
    { schemaCliente } = require('../../../schema/api/cliente'),
    { responseHandler, ObjectIdCast } = require('../../../utils')

/**
* @description Register new cliente
* @author jaffar cardoso <jaffa.cardoso@gmail.com>
* @async
* @function register
* @param {Object} obj - Object contem email e status;
* @returns {Promise.<Object>} The result
* @throws Will throw an error if the argument is null.
*/
exports.cadastrarComanda = async (obj) => {

    let post = new schemaComanda(obj);

    const cliente = await schemaCliente.findById(obj.cliente);

    post.dataEntrada = new Date().getDate();
    post.grupo.push(obj);

    if (cliente.configClienteAtual.estabelecimento != obj.estabelecimento)
        return {status: true, msg: "CLIENTE_NAO_ESTA_NO_ESTABELECIMENTO"}
    else if (cliente.configClienteAtual.comanda != null)
        return {status: true, msg: "CLIENTE_JA_TEM_COMANDA"}

    return await post.save().then(() => {  
        cliente.configClienteAtual.comanda = post._id;
        return schemaCliente.findByIdAndUpdate(cliente._id, cliente).then(() => { return post; });   
    }).catch(err => {
        throw responseHandler(err);
    });        
};


/**
* @description Register new cliente
* @author jaffar cardoso <jaffa.cardoso@gmail.com>
* @async
* @function register
* @param {Object} obj - Object contem comanda, produto e quantidade
* @returns {Promise.<Object>} The result
* @throws Will throw an error if the argument is null.
*/
exports.cadastrarItemComanda = async (obj) => {

    const { schemaProduto } = require('../../../schema/api/produto');

    const comanda = await schemaComanda.findById(obj.comanda);
    const produto = await schemaProduto.findById(obj.produto);

    if (produto.estoque < obj.quantidade)
        return {status: true, msg : "ITEM_LOJA_SEM_ESTOQUE"}

    let index = -1;
    for (let i = 0; i < comanda.produtos.length; i++){
        if (comanda.produtos[i].produto.toString() == produto._id.toString()){            
            index = i;
            break;
        }
    }

    if (index > -1){        
        comanda.produtos[index].preco = produto.preco;
        comanda.produtos[index].quantidade += obj.quantidade;
        comanda.produtos[index].precoTotal += obj.quantidade * produto.preco;
    }else{
        obj.preco = produto.preco;
        comanda.produtos.push(obj);
    }

    obj.precoTotal = obj.quantidade * produto.preco;

    produto.estoque -= obj.quantidade;
    comanda.valorTotal += obj.precoTotal;

    return await schemaComanda.findByIdAndUpdate(comanda._id, comanda).then(() => {  
        return schemaProduto.findByIdAndUpdate(produto._id, produto).then(() => {
            return comanda;
        });
    }).catch(err => {
        throw responseHandler(err);
    });        
};
