const { AlterarAvatar } = require('../../../service/api/avatar/alterarAvatar'),
      { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {
const obj = req.body;
console.log(obj);
AlterarAvatar(obj).then((result) => resJsonP(res, 200, result.resulObj.status,null, res.__(result.resulObj.msg)))
    .catch((err) => resJsonP(res, 200, false, res.__(err.message)));
};