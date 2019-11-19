const { ObterEstabelecimento } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000//listar/obter/estabelecimento Obter Estabelecimento
    * @apiSampleRequest http://93.188.164.122:3000//listar/obter/estabelecimento
    * @apiName estabelecimento_obter
    * @apiGroup Estabelecimento_Estabelecimento
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para obter as informações do estabelecimento
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Object} retorno Objeto que contém as informações do estabelecimento
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem  Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": true,
    *           "retorno": {
    *               "coordenadas": {
    *                   "lat": "-23.471146",
    *                   "long": "-47.450026"
    *               },
    *               "endereco": {
    *                   "rua": "Rua boa pergunta",
    *                   "numero": 326,
    *                   "bairro": "Vila Santana",
    *                   "cidade": "Sorocaba",
    *                   "cep": "18010-003",
    *                   "estado": "SP"
    *               },
    *               "configEstabelecimentoAtual": {
    *                   "estaAberta": true,
    *                   "clientesNoLocal": [
    *                       "5da477d35f54283e4a826908",
    *                       "5daf8ac752b9f543d0d7a0ea",
    *                       "5db9ec099452080fe4fde8fb",
    *                       "5db9ec099452080fe4fde8fb",
    *                       "5db9eb13ddbc6a6108df60b0"
    *                       ...
    *                   ]
    *               },
    *               "status": true,
    *               "desafios": [
    *                   "5dae4c5f5f54283e4a82690d",
    *                   "5dae4d815f54283e4a82690e",
    *                   "5dae4de85f54283e4a82690f",
    *                   "5dae4e1e5f54283e4a826910",
    *                   "5dafa0a30a6dc34f64b98828",
    *                   "5dafa0d80a6dc34f64b98829",
    *                   "5dafa0fb0a6dc34f64b9882a",
    *                   "5dafa1210a6dc34f64b9882b",
    *                   "5dc206495b85ca5b7cf23aa8",
    *                   "5dcb484028d2e47150dacf14"
    *                   ...
    *               ],
    *               "produtos": [
    *                   "5dae49ec5f54283e4a82690c",
    *                   "5dc050d94b245a7cfd18b425"
    *                   ...
    *               ],
    *               "roles": [
    *                   "5da46cda540f2c3cd46cfdb2"
    *                   ...
    *               ],
    *               "estabelecimentoUsuarios": [],
    *               "_id": "5da46cda540f2c3cd46cfdb3",
    *               "email": "estab1@email.com",
    *               "tipo": "Restaurante",
    *               "nome": "Torremos",
    *               "descricao": "Churrascaria de primeira qualidade",
    *               "cnpj": "31.767.071/0001-48",
    *               "telefone": "(15) 3265-9865",
    *               "celular": "(15) 99876-5648",
    *               "emailContato": "contato@estab2.com",
    *               "horarioAtendimentoInicio": "10:00",
    *               "horarioAtendimentoFim": "16:00",
    *               "itensLoja": [
    *                   {
    *                       "_id": "5dc21183fed7b1592cf2b258"
    *                   },
    *                   {
    *                       "_id": "5dcc83c81cbb85243c9f56b5"
    *                   }
    *               ]
    *           }
    *       }
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

    ObterEstabelecimento(req.user.estabelecimentoId).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ObterEstabelecimento:', error);
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        });
};