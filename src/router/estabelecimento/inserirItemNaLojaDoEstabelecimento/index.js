const { InserirItemNaLojaDoEstabelecimento } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {
    const obj = req.body;
    InserirItemNaLojaDoEstabelecimento(obj).then((result) => result.resulObj.msg ? resJsonP(res, 200, false, null,  res.__(result.resulObj.msg) ) : resJsonP(res, 200, result.status, !result.msg ? result.resulObj : res.__(result.msg))).catch((err) => resJsonP(res, 200, false,null, res.__(err.message)));
};