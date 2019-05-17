
const { ListarParaClientes } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    ListarParaClientes(req.body.nome).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
    // eslint-disable-next-line no-undef
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarParaClientes:', error);
            // eslint-disable-next-line no-undef
            resJsonP(res, 200, false, null, Mensagens.ESTABELECIMENTO_CADASTRAR_ERRO);
        });
};