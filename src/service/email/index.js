module.exports = (cliente, novaSenha) => {

    var nodemailer = require('nodemailer');
    const { EMAIL, EMAIL_SENHA } = require('../../../config');

    // O primeiro passo é configurar um transporte para este
    // e-mail, precisamos dizer qual servidor será o encarregado
    // por enviá-lo:
    var transporte = nodemailer.createTransport({
        service: 'Gmail', // Como mencionei, vamos usar o Gmail
        auth: {
            user: EMAIL, // Basta dizer qual o nosso usuário
            pass: EMAIL_SENHA             // e a senha da nossa conta
        }
    });

    // Após configurar o transporte chegou a hora de criar um e-mail
    // para enviarmos, para isso basta criar um objeto com algumas configurações
    var email = {
        from: EMAIL, // Quem enviou este e-mail
        to: cliente.email, // Quem receberá
        subject: 'Recuperação de Senha',  // Um assunto bacana :-)
        html: 'Olá '+cliente.nome+',<br/> Conforme solicitado, segue sua nova senha: <strong>'+novaSenha+'</strong> <br/>' // O conteúdo do e-mail
    };

    // Pronto, tudo em mãos, basta informar para o transporte
    // que desejamos enviar este e-mail
    transporte.sendMail(email, function(err, info){
        if(err)
            throw err; // Oops, algo de errado aconteceu.

        console.log('Email enviado! Leia as informações adicionais: ', info);
    });

};