const { EntrarNoEstabelecimento } = require('../../../../service/api/cliente/entrarNoEstabelecimento'),
      { resJsonP } = require('../../../../utils');

module.exports = () => (req, res) => {
const obj = req.body;
EntrarNoEstabelecimento(obj).then((result) => result.resulObj.msg ? resJsonP(res, 200, result.resulObj.status, null,  res.__(result.resulObj.msg) + result.resulObj.nomeEstabelecimento + "!") : resJsonP(res, 200, result.status, !result.msg ? result.resulObj : res.__(result.msg))).catch((err) => resJsonP(res, 200, false, res.__(err.message)));
};