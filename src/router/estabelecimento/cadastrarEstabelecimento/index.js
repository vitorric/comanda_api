const { CadastrarEstabelecimento } = require('../../../service/api/estabelecimento'),
    { resJsonP } = require('../../../utils');

/**
    * @api {post} http://93.188.164.122:3000/api/cadastrar/estabelecimento Cadastrar
    * @apiSampleRequest http://93.188.164.122:3000/api/cadastrar/estabelecimento
    * @apiName estabelecimento_cadastrar
    * @apiGroup Estabelecimento_Usuario
    *
    * @apiVersion 1.0.0
    *
    * @apiDescription Rota para cadastrar um estabelecimento
    *
    * @apiHeader Authorization Bearer Authentication token.
    * @apiHeaderExample {json} Header-Example:
    *     {
    *       content-type: 'application/json',
    *       Authorization: 'Bearer authentication'
    *     }
    *
    * @apiParam {String} email Email do estabelecimento
    * @apiParam {String} password Password do estabelecimento criptografo em MD5
    * @apiParam {Boolean} status Status do estabelecimento
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
    * @apiSuccess {Object} retorno Objeto que contém as informações do estabelecimento cadastrado
    *
    * @apiError {Boolean} sucesso <code>false</code>
    * @apiError {string} mensagem  Mensagem contendo o problema
    *
    *
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *         "sucesso": true,
    *         "retorno": {
    *             "configEstabelecimentoAtual": {
    *                 "estaAberta": false,
    *                 "clientesNoLocal": []
    *             },
    *             "status": true,
    *             "desafios": [],
    *             "produtos": [],
    *             "roles": [
    *                 {
    *                     "status": 1,
    *                     "_id": "5dcc82600014be15ce65c33f",
    *                     "modulos": [],
    *                     "nome": "Administrador",
    *                     "createdAt": "2019-11-13T22:23:28.219Z",
    *                     "updatedAt": "2019-11-13T22:23:28.219Z",
    *                     "__v": 0
    *                 }
    *             ],
    *             "estabelecimentoUsuarios": [],
    *             "_id": "5dcc82600014be15ce65c340",
    *             "email": "estab2@email.com",
    *             "password": "$2a$10$xoAbdsD5sHz0Bf0m4r1OCuE33BWuKY5IUAlKOhqM2Chy/EjNlSjze",
    *             "tipo": "Restaurante",
    *             "nome": "Torremos2",
    *             "descricao": "Churrascaria de primeira qualidade2",
    *             "cnpj": "31.767.071/0001-47",
    *             "telefone": "(15) 3265-9865",
    *             "celular": "(15) 99876-5648",
    *             "emailContato": "contato@estab2.com",
    *             "horarioAtendimentoInicio": "10:00",
    *             "horarioAtendimentoFim": "16:00",
    *             "endereco": {
    *                 "rua": "Rua boa pergunta",
    *                 "numero": 326,
    *                 "bairro": "Vila Santana",
    *                 "cidade": "Sorocaba",
    *                 "cep": "18010-003",
    *                 "estado": "SP"
    *             },
    *             "coordenadas": {
    *                 "lat": "1234567",
    *                 "long": "7654321"
    *             },
    *             "itensLoja": [],
    *             "createdAt": "2019-11-13T22:23:28.226Z",
    *             "updatedAt": "2019-11-13T22:23:28.226Z",
    *             "__v": 0
    *         }
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

    CadastrarEstabelecimento(req.body).then((result) => resJsonP(res, 200, result.status, result.objeto, result.mensagem))
        .catch((error) => {
            console.log('\x1b[31m%s\x1b[0m', 'Erro in ListarParaClientes:', error);
            return { status: false , mensagem: Mensagens.SOLICITACAO_INVALIDA };
        });
};