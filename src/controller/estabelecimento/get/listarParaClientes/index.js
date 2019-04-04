
const { ListarParaClientes } = require('../../../../service/api/estabelecimento/listarParaClientes'),
 { resJsonP } = require('../../../../utils');

module.exports = () => (req, res) => {
    ListarParaClientes(req.query).then(result => resJsonP(res, 200, result.status, !result.msg ? result.resulObj : res.__(result.msg)))
    .catch(err => resJsonP(res, 200, false, res.__(err.message)));
};