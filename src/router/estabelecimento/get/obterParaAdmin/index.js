const { ObterParaAdmin } = require('../../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../../utils');

module.exports = () => (req, res) => {
    ObterParaAdmin(req.query).then(result => resJsonP(res, 200, result.status, !result.msg ? result.resulObj : res.__(result.msg)))
        .catch(err => resJsonP(res, 200, false,null, res.__(err.message)));
};