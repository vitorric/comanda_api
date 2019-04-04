const { ListarItemLoja } = require('../../../../service/api/itemLoja/listar'),
 { resJsonP } = require('../../../../utils');

module.exports = () => (req, res) => {
   ListarItemLoja(req.query).then(result => resJsonP(res, 200, result.status, !result.msg ? result.resulObj : res.__(result.msg)))
   .catch(err => resJsonP(res, 200, false, res.__(err.message)));
};