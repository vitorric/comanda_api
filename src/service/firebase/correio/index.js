const connFb = require('../../../conn/firebase');

exports.FBInserirMensagemNoCorreio = async (correioCliente) => {
    try
    {
        let correio = [];

        correioCliente.correio.map((value) => {

            if (value.status)
            {
                let mensagem = {
                    _id: value._id,
                    titulo: value.titulo,
                    mensagem: value.mensagem,
                    mensagemGrande: value.mensagemGrande,
                    lida: value.lida,
                    dataCriacao: value.dataCriacao,
                    status: true
                };

                if (typeof value.acao.tipo !== 'undefined')
                {
                    let acao = {
                        tipo: value.acao.tipo,
                        executouAcao: value.acao.executouAcao
                    };

                    if (typeof value.acao.comanda !== 'undefined')
                        acao.comanda = value.acao.comanda;
                    if (typeof value.acao.cliente !== 'undefined')
                        acao.cliente = value.acao.cliente;
                    if (typeof value.acao.dinheiro !== 'undefined')
                        acao.dinheiro = value.acao.dinheiro;
                    if (typeof value.acao.exp !== 'undefined')
                        acao.exp = value.acao.exp;
                    if (typeof value.acao.pontos !== 'undefined')
                        acao.pontos = value.acao.pontos;

                    mensagem.acao = acao;
                }

                correio.push(mensagem);
            }
        });

        let novaMensagem = {
            cliente: correioCliente.cliente.toString(),
            correio: correio
        };

        connFb.database().ref('/correios/' + novaMensagem.cliente.toString()).update(novaMensagem);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
};