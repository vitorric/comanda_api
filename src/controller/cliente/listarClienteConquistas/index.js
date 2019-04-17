const { ListarClienteConquistas } = require('../../../service/api/cliente/listarClienteConquistas'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {
    ListarClienteConquistas(req.body).then(result => resJsonP(res, 200, result.status, !result.msg ? result.resulObj : res.__(result.msg)))
        .catch(err => resJsonP(res, 200, false,null, res.__(err.message)));
};