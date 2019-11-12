const connFb = require('../../../conn/firebase');

exports.NotificacaoConviteGrupo = (tokenFirebase, nomeLider) => {
    console.log(tokenFirebase);
    if (tokenFirebase.length > 0) {
        try
        {
            let payload = {
                notification: {
                    title: 'Novo Convite de Grupo',
                    body: `${nomeLider} esta te convidando ao grupo da comanda!`
                }
            };
            const options = {
                priority: 'high',
                timeToLive: 60 * 60 * 24
            };

            connFb.messaging().sendToDevice(tokenFirebase, payload, options)
                .then((response) => {
                //console.log('response', response);
                    return true;
                })
                .catch((error) => console.log('error', error));

        }
        catch(error)
        {
            console.log(error);
        }
    }
};

exports.NotificacaoCorreio = tokenFirebase => {
    if (tokenFirebase.length > 0) {
        try
        {
            let payload = {
                notification: {
                    title: 'Novo Mensagem no Correio',
                    body: 'Você recebeu uma nova mensagem no correio!'
                }
            };
            const options = {
                priority: 'high',
                timeToLive: 60 * 60 * 24
            };

            connFb.messaging().sendToDevice(tokenFirebase, payload, options)
                .then((response) => {
                //console.log('response', response);
                    return true;
                })
                .catch((error) => console.log('error', error));
        }
        catch(error)
        {
            console.log(error);
        }
    }
};

exports.NotificacaoDesafioConcluido = tokenFirebase => {
    try
    {
        if (tokenFirebase.length > 0) {
            let payload = {
                notification: {
                    title: 'Desafio Concluído!',
                    body: 'Você concluiu um desafio, resgate seu prêmio!'
                }
            };
            const options = {
                priority: 'high',
                timeToLive: 60 * 60 * 24
            };

            connFb.messaging().sendToDevice(tokenFirebase, payload, options)
                .then((response) => {
                //console.log('response', response);
                    return true;
                })
                .catch((error) => console.log('error', error));
        }
    }
    catch(error)
    {
        console.log(error);
    }
};

exports.NotificacaoComandaCriada = (tokenFirebase, nomeEstabelecimento) => {
    try
    {
        if (tokenFirebase.length > 0) {
            let payload = {
                notification: {
                    title: 'Atenção! Uma Nova Comanda foi Criada!',
                    body: `O estabelecimento ${nomeEstabelecimento} criou uma comanda para você!`
                }
            };
            const options = {
                priority: 'high',
                timeToLive: 60 * 60 * 24
            };

            connFb.messaging().sendToDevice(tokenFirebase, payload, options)
                .then((response) => {
                    ////console.log('response', response);
                    return true;
                })
                .catch((error) => console.log('error', error));
        }
    }
    catch(error)
    {
        console.log(error);
    }
};

exports.NotificacaoItemAdicionadoComanda = (tokenFirebase, quantidade, nomeItem) => {
    try
    {
        if (tokenFirebase.length > 0) {
            let payload = {
                notification: {
                    title: 'Sua Comanda foi Alterada!',
                    body: `Acrescentado ${quantidade}x ${nomeItem}`
                }
            };
            const options = {
                priority: 'high',
                timeToLive: 60 * 60 * 24
            };

            connFb.messaging().sendToDevice(tokenFirebase, payload, options)
                .then((response) => {
                //console.log('response', response);
                    return true;
                })
                .catch((error) => console.log('error', error));
        }
    }
    catch(error)
    {
        console.log(error);
    }
};