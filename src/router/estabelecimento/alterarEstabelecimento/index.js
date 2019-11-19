const { AlterarEstabelecimento } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/adicionar/estabelecimento/cliente Adicionar Cliente Ao Estabelecimento
    * @apiSampleRequest http://93.188.164.122:3000/api/adicionar/estabelecimento/cliente
    * @apiName estabelecimento_adicionar_cliente
    * @apiGroup Estabelecimento_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para informar que o cliente resgatou a recompensa
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} tipo Tipo do estabelecimento
    * @apiParam {String} descricao Descricao do estabelecimento
    * @apiParam {String} telefone Telefone do estabelecimento
    * @apiParam {String} celular Celular do estabelecimento
    * @apiParam {String} emailContato emailContato do estabelecimento
    * @apiParam {String} horarioAtendimento Início horário de atendimento do estabelecimento
    * @apiParam {String} horarioAtendimentoFim Fim do horário de atendimento do estabelecimento
    * @apiParam {Object} endereco Objeto de endereco do estabelecimento
    * @apiParam {String} endereco.rua Rua do estabelecimento
    * @apiParam {String} endereco.numero Número do estabelecimento
    * @apiParam {String} endereco.bairro Bairro do estabelecimento
    * @apiParam {String} endereco.cidade Cidade do estabelecimento
    * @apiParam {String} endereco.cep CEP do estabelecimento
    * @apiParam {String} endereco.estado Estado do estabelecimento
    * @apiParam {Object} coordenadas Objeto das coordenadas do estabelecimento
    * @apiParam {String} coordenadas.lat Latitude do estabelecimento
    * @apiParam {String} coordenadas.long Longitude do estabelecimento
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem  Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *         "sucesso": true
    *     }
    *
    * @apiErrorExample {json} Senha inválida:
    *     HTTP/1.1 401 Unauthorized
    *     {
    *       Unauthorized
    *     }
    * @apiErrorExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *         "sucesso": false,
    *         "mensagem": "Mensagem de erro"
    *     }
**/

module.exports = () => (req, res) => {

    AlterarEstabelecimento(req.user.estabelecimentoId, req.body).then((result) => resJsonP(res, 200, result.status))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in AlterarEstabelecimento:', error);
            resJsonP(res, 200, false, null, Mensagens.SOLICITACAO_INVALIDA);
        });

};
