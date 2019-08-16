
const { ListarParaClientes } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

module.exports = () => (req, res) => {

    ListarParaClientes(req.body.nome).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarParaClientes:', error);
            resJsonP(res, 200, false, null, Mensagens.ESTABELECIMENTO_CADASTRAR_ERRO);
        });
};