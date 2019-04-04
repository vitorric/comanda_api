const { RecuperarSenha } = require('../../../../service/api/cliente/recuperarSenha'),
    { resJsonP } = require('../../../../utils');

module.exports = () => (req, res) => {  
    RecuperarSenha(req.body).then((result) => resJsonP(res, 200, result.resulObj.status,null, res.__(result.resulObj.msg)))
    .catch((err) => resJsonP(res, 200, false, res.__(err.message)));
};