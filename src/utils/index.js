/**
 * Biblioteca para funções úteis no sistema
 *
 * @module Library/Utils
 */
const mongoose = require('mongoose'),
    request = require('request'),
    bcrypt = require('bcryptjs'),
    crypto = require('crypto');


exports.ObjectIdCast = mongoose.mongo.ObjectId;

/**
* Função para padronizar o retorno e deixar ele mais fácil de ser escrito
* @param {object} res [objeto da requisição que esta sendo recebida]
* @param {number} code [código que será enviado na resposta]
* @param {boolean} sucesso [true/false que será enviado na resposta]
* @param {object} retorno [Objeto, texto ou erro que será enviado no retorno da resposta]
* @param {string} msg [Mensagem que será enviada]
* @return resposta da requisição (res.status....)
*/
exports.resJsonP = (res, code, sucesso, retorno, mensagem) => {
    let retornoObj = { sucesso: sucesso };

    if (retorno != null)
        retornoObj.retorno = retorno;

    if (mensagem != null)
        retornoObj.mensagem = mensagem;

    return res.status(code).jsonp(retornoObj);
};

exports.gerarChaveAmigavel = () =>
{
    let chaveAmigavel = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
    return chaveAmigavel.toUpperCase();
};

exports.getMD5 = (password) => crypto.createHash('md5').update(password, 'utf-8').digest('hex');

exports.recuperarSenha = async () => {
    try{
        let randPassword = Array(10).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz').map(function(x) { return x[Math.floor(Math.random() * x.length)]; }).join('');

        let md5Password = await crypto.createHash('md5').update(randPassword, 'utf-8').digest('hex');
        console.log(md5Password);
        // Generate a salt
        let salt = await bcrypt.genSalt(10);
        // Gerenate a password hash (salt + hash)
        let passwordHash = await bcrypt.hash(md5Password, salt);

        return { novaSenha: randPassword, novaSenhaBanco: passwordHash };
    }catch(error){
        throw new Error(error);
    }
};


/**
* Função The Default Error Handler para tratar error do mongodb
* @param {object} error object com lista de erro
* @return {boolena} retorna se tiver erro do mongodb
* @return {number} retorna se nao tiver erro do mongodb
*/
exports.responseHandler = (error) => {
    let options = {
        method: 'post',
        body: {
            'metadata': {
                'title': '/api/register/user',
                'type': 'error',
                'icon': 'fa-bug'
            },
            'body': {
                'error': error,
                'error_description': error.errmsg
            }
        },
        json: true,
        url: 'http://localhost:4000/api/log/default',
        headers: {
            'Accept': 'application/json'
        }
    };

    request(options, function (err) {
        if (err) {
            console.log('Error :', err);
            return false;
        }
    });
    if (error.code === 11000) {
        let keyErrorRegex = /duplicate key error index:\s+(.+?)\s+/g;
        let duplicateKey = keyErrorRegex.exec(error.err);
        if (!duplicateKey) {
            return 0;
        }
        return 0;
    }
    return false;
};



