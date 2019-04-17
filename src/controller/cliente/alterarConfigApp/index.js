const { AlterarClienteConfigApp } = require('../../../service/api/cliente/alterarConfigApp'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {
    const obj = req.body;
    AlterarClienteConfigApp(obj).then((result) => resJsonP(res, 200, result.resulObj.status,null, res.__(result.resulObj.msg)))
        .catch((err) => resJsonP(res, 200, false,null, res.__(err.message)));
};