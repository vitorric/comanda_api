const { comprarItemLoja } = require('../../../repository/api/historicoCompraLojas'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => 
{
    comprarItemLoja(req.user.clienteId).then((result) => resJsonP(res, 200, true, result)).catch((err) => resJsonP(res, 200, false, err.message));
};