const { ListarProdutos } = require('../../../../service/api/produto/listar'),
    { resJsonP } = require('../../../../utils');

module.exports = () => (req, res) => {
    ListarProdutos(req.query).then(result => resJsonP(res, 200, result.status, !result.msg ? result.resulObj : res.__(result.msg)))
        .catch(err => resJsonP(res, 200, false,null, res.__(err.message)));
};