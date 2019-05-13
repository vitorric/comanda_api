const { cadastrarCliente, obterClienteParaCadastro, obterCliente } = require('../../../repository/api/cliente'),
    { resJsonP, gerarChaveAmigavel } = require('../../../utils'),
    { Criar } = require('../../../service/firebase/cliente'),
    cadastrarAvatar = require('../../avatar/cadastrarAvatar')(),
    JWT = require('jsonwebtoken'),
    {JWT_SECRET} = require('../../../../config');


let signToken = cliente => {
    try{
        return 'jwt ' + JWT.sign({
            issuer: 'Comanda',
            cliente,
            exp: Math.floor(Date.now() / 1000) + (60 * 60)
        },JWT_SECRET);
    }catch(error){
        console.log(error);
    }
};


module.exports = () => async (req, res)  => {
    try
    {
        let cliente = req.body;

        if (!cliente.email ||
            !cliente.password ||
            !cliente.nome ||
            !cliente.apelido ||
            !cliente.sexo ||
            !cliente.avatar)
        {
        // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, {mensagem: Mensagens.CLIENTE_CADASTRAR_ERRO});
            return;
        }

        let clienteEncontrado = await obterClienteParaCadastro(cliente.email, cliente.cpf);

        if (typeof clienteEncontrado !== 'undefined')
        {

            if (clienteEncontrado.email === cliente.email)
            {
            // eslint-disable-next-line no-undef
                resJsonP(res, 200, false, {mensagem: Mensagens.CLIENTE_CADASTRAR_EMAIL});
                return;
            }

            if (clienteEncontrado.apelido === cliente.apelido)
            {
            // eslint-disable-next-line no-undef
                resJsonP(res, 200, false, {mensagem: Mensagens.CLIENTE_CADASTRAR_APELIDO});
                return;
            }
        }

        let avatar = await cadastrarAvatar((typeof cliente.avatar === 'object') ? cliente.avatar : JSON.parse(cliente.avatar));

        if (!avatar){
        // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, {mensagem: Mensagens.AVATAR_CADASTRAR_ERRO});
            return;
        }

        cliente.avatar = avatar._id;
        cliente.chaveAmigavel = gerarChaveAmigavel();

        cliente = await cadastrarCliente(cliente);

        obterCliente(cliente._id).then(async (result) => {
            Criar(result).then(() => {

                // Generate the token
                let token = signToken({ _id: result._id });

                resJsonP(res, 200, true, { token, _id: cliente._id } );
            });

        });
    }
    catch(error)
    {
        console.log(error);
        // eslint-disable-next-line no-undef
        resJsonP(res, 200, false, {mensagem: Mensagens.CLIENTE_CADASTRAR_ERRO});
    }
};