const { Alterar } = require('../../../../service/api/cliente/alterar'),
      { resJsonP } = require('../../../../utils');

module.exports = () => (req, res) => {
const obj = req.body;
Alterar(obj).then((result) => resJsonP(res, 200, result.resulObj.status,null, res.__(result.resulObj.msg)))
    .catch((err) => resJsonP(res, 200, false, res.__(err.message)));
};