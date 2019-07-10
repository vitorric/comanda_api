const { BASE_EXP, MULT_EXP } = require('../../../config/game');

exports.CalcularExpProLvl = async (lvl) => {
    let expBase = BASE_EXP;

    for (let i =0; i < lvl; i++)
    {
        expBase = expBase * MULT_EXP;
    }

    return expBase;
};