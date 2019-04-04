const { ListarParaAdmin } = require('../../../../service/api/estabelecimento/listarParaAdmin'),
 { resJsonP } = require('../../../../utils');

module.exports = () => (req, res) => {
   ListarParaAdmin(req.query).then(result => resJsonP(res, 200, result.status, !result.msg ? result.resulObj : res.__(result.msg)))
   .catch(err => resJsonP(res, 200, false, res.__(err.message)));
};