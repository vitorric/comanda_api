const { ComprarItemLoja } = require('../../../../service/api/cliente/comprarItemLoja'),
      { resJsonP } = require('../../../../utils');

module.exports = () => (req, res) => {
const obj = req.body;
ComprarItemLoja(obj).then((result) => resJsonP(res, 200, result.resulObj.status,null, res.__(result.resulObj.msg)))
    .catch((err) => resJsonP(res, 200, false, res.__(err.message)));
};