
const { login } = require('../../../../service/api/user/login'),
    { resJsonP } = require('../../../../utils');

module.exports = () => (req, res) => {
    req.user.msg ? resJsonP(res, 200, false,  null, res.__(req.user.msg) ) :
        login(req.user).then((result) => resJsonP(res, 200, result.status, !result.msg ? result.resulObj : res.__(result.msg)))
            .catch((err) => resJsonP(res, 200, false,null, res.__(err.message)));
};