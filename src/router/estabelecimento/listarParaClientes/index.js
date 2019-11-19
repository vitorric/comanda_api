
const { ListarParaClientes } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/listar/estabelecimento/cliente Listar Estabelecimento Cliente
    * @apiSampleRequest http://93.188.164.122:3000/listar/estabelecimento/cliente
    * @apiName estabelecimento_cliente_listar
    * @apiGroup Estabelecimento_Cliente
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para listar os estabelecimentos para os clientes
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiSuccess {Boolean} sucesso <code>true</code>
    * @apiSuccess {Array} retorno Array de objetos dos estabelecimentos
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem  Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *       {
    *           "sucesso": true,
    *           "retorno": [
    *               {
    *                   "_id": "5da46cda540f2c3cd46cfdb3",
    *                   "configEstabelecimentoAtual": {
    *                       "estaAberta": true,
    *                       "clientesNoLocal": [
    *                           "5da477d35f54283e4a826908",
    *                           "5daf8ac752b9f543d0d7a0ea",
    *                           "5db9ec099452080fe4fde8fb",
    *                           "5db9ec099452080fe4fde8fb",
    *                           "5db9eb13ddbc6a6108df60b0"
    *                       ]
    *                   },
    *                   "tipo": "Restaurante",
    *                   "nome": "Torremos",
    *                   "descricao": "Churrascaria de primeira qualidade",
    *                   "cnpj": "31.767.071/0001-48",
    *                   "telefone": "(15) 3265-9865",
    *                   "celular": "(15) 99876-5648",
    *                   "emailContato": "contato@estab2.com",
    *                   "horarioAtendimentoInicio": "10:00",
    *                   "horarioAtendimentoFim": "16:00",
    *                   "endereco": {
    *                       "rua": "Rua boa pergunta",
    *                       "numero": 326,
    *                       "bairro": "Vila Santana",
    *                       "cidade": "Sorocaba",
    *                       "cep": "18010-003",
    *                       "estado": "SP"
    *                   }
    *               },
    *               {
    *                   "_id": "5dcc82600014be15ce65c340",
    *                   "configEstabelecimentoAtual": {
    *                       "estaAberta": false,
    *                       "clientesNoLocal": []
    *                   },
    *                   "tipo": "Restaurante",
    *                   "nome": "Torremos2",
    *                   "descricao": "Churrascaria de primeira qualidade2",
    *                   "cnpj": "31.767.071/0001-47",
    *                   "telefone": "(15) 3265-9865",
    *                   "celular": "(15) 99876-5648",
    *                   "emailContato": "contato@estab2.com",
    *                   "horarioAtendimentoInicio": "10:00",
    *                   "horarioAtendimentoFim": "16:00",
    *                   "endereco": {
    *                       "rua": "Rua boa pergunta",
    *                       "numero": 326,
    *                       "bairro": "Vila Santana",
    *                       "cidade": "Sorocaba",
    *                       "cep": "18010-003",
    *                       "estado": "SP"
    *                   }
    *               }
    *           ]
    *           ...
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

    ListarParaClientes(req.body.nome).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarParaClientes:', error);
            resJsonP(res, 200, false, null, Mensagens.ESTABELECIMENTO_CADASTRAR_ERRO);
        });
};