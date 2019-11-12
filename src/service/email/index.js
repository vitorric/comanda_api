const nodemailer = require('nodemailer'),
    { EMAIL, EMAIL_SENHA, URL_PORTAL } = require('../../../config');

exports.EnviarEmailRecuperarSenha = (emailCliente, nomeCliente, token) => {
    try
    {
        // O primeiro passo é configurar um transporte para este
        // e-mail, precisamos dizer qual servidor será o encarregado
        // por enviá-lo:
        let transporte = nodemailer.createTransport({
            service: 'Gmail', // Como mencionei, vamos usar o Gmail
            auth: {
                user: EMAIL, // Basta dizer qual o nosso usuário
                pass: EMAIL_SENHA             // e a senha da nossa conta
            }
        });

        // Após configurar o transporte chegou a hora de criar um e-mail
        // para enviarmos, para isso basta criar um objeto com algumas configurações
        let email = {
            from: EMAIL, // Quem enviou este e-mail
            to: emailCliente, // Quem receberá
            subject: 'Recuperação de Senha',  // Um assunto bacana :-)
            html: 'Olá '+nomeCliente+',<br/> foi feita uma solicitação de alteração de senha no aplicativo CPG, <a href="'+ `${URL_PORTAL}/alterar_senha/${token}/${emailCliente}` +'">clique aqui</a> e faça a alteração.<br/>' // O conteúdo do e-mail
        };

        // Pronto, tudo em mãos, basta informar para o transporte
        // que desejamos enviar este e-mail
        transporte.sendMail(email, function(err, info)
        {
            if(err)
            {
                console.log('Erro: EnviarEmailRecuperarSenha');
                console.log(err);
                return;
            }

            console.log('Email enviado! Leia as informações adicionais: ', info);
        });
    }
    catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Erro in EnviarEmailRecuperarSenha:', error);
        return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
    }
};

// module.exports = (emailCliente, nomeCliente, novaSenha) => {

//     var nodemailer = require('nodemailer');
//     const { EMAIL, EMAIL_SENHA } = require('../../../config');

//     // O primeiro passo é configurar um transporte para este
//     // e-mail, precisamos dizer qual servidor será o encarregado
//     // por enviá-lo:
//     var transporte = nodemailer.createTransport({
//         service: 'Gmail', // Como mencionei, vamos usar o Gmail
//         auth: {
//             user: EMAIL, // Basta dizer qual o nosso usuário
//             pass: EMAIL_SENHA             // e a senha da nossa conta
//         }
//     });

//     // Após configurar o transporte chegou a hora de criar um e-mail
//     // para enviarmos, para isso basta criar um objeto com algumas configurações
//     var email = {
//         from: EMAIL, // Quem enviou este e-mail
//         to: emailCliente, // Quem receberá
//         subject: 'Recuperação de Senha',  // Um assunto bacana :-)
//         html: 'Olá '+nomeCliente+',<br/> Conforme solicitado, segue sua nova senha: <strong>'+novaSenha+'</strong> <br/>' // O conteúdo do e-mail
//     };

//     // Pronto, tudo em mãos, basta informar para o transporte
//     // que desejamos enviar este e-mail
//     transporte.sendMail(email, function(err, info){
//         if(err)
//             throw err; // Oops, algo de errado aconteceu.

//         console.log('Email enviado! Leia as informações adicionais: ', info);
//     });

// };