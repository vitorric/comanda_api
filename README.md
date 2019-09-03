# API - Comanda Gameficada

## Introdução
Esta é a API do projeto **Comanda Gameficada**, esta API é utilizada no aplicativo Mobile e no Portal.

## Preparação

Antes de iniciar, é necessário instalar o [Node](http://nodejs.org/), o [Git](https://git-scm.com/), o [MongoDB](https://www.mongodb.com/download-center/community) e o [Postman](https://www.getpostman.com/downloads/) localmente.

**OBS:**: Todos os métodos da API são Post, logo, é necessário o Postman ou outro método que consiga fazer Post em requisições.

* **Versão do NodeJS**: v10.16.0
* **Versão do MongoDB**: v4.0.11

## Estrutura de pasta

``` bash
├───config
│   ├───bd
│   └───game
├───locales
├───public
│   └───files
│       ├───...
└───src
    ├───conn
    │   ├───firebase
    │   │   └───data
    │   └───mongo
    ├───repository
    │   └───api
    │       ├───...
    ├───router
    │   ├───avatar
    │   │   ├───...
    │   ├───cliente
    │   │   ├───...
    │   ├───comanda
    │   │   ├───...
    │   ├───correio
    │   │   └───...
    │   ├───desafio
    │   │   ├───...
    │   ├───downloadFiles
    │   │   └───...
    │   ├───estabelecimento
    │   │   ├───...
    │   ├───itemLoja
    │   │   ├───...
    │   ├───produto
    │   │   ├───...
    │   ├───uploadFiles
    │   │   ├───...
    │   └───usuario
    │       ├───...
    ├───schema
    │   └───api
    │       ├───...
    ├───service
    │   ├───api
    │   │   ├───...
    │   ├───cron
    │   ├───email
    │   ├───firebase
    │   │   ├───...
    │   ├───game
    │   ├───passaport
    │   │   ├───...
    │   └───watch
    │       └───firebase
    └───utils
```

## Fluxo da API

O Fluxo da API se inicia com uma requisição em uma rota (URL). Cada rota é importa uma pasta com o nome do método do serviço, que consequentemente irá executa-lo. A camada de serviço é onde será executada toda a regra de negócio da requisição, e o mesmo, pode tanto manipular informações do MongoDB quanto do Firebase.
Segue abaixo uma imagem representando o fluxo:

<p align="center">
  <img src="https://uploaddeimagens.com.br/images/002/315/407/original/fluxo_api.png?1567468117">
</p>

## Instalação
 
 * Verifique se o MongoDB esta em execução, caso não esteja, vá até a pasta que você o instalou, e execute o arquivo **mongod.exe**.

 * Faça o clone deste projeto (será criado uma pasta chamada comanda_api)
 
 * Acesse a pasta do projeto, abra o terminal e instale as dependências:
```bash
npm install

npm install -g nodemon

```

 * Após isso, basta iniciar a API.
```bash
nodemon
```

Caso tudo tenha sido executado corretamente, será apresentado no terminal as seguintes mensagens:
```bash
Server running on port 3000
Mongodb connection dev
```

## Testando API
Abra o Postman, e teste a seguinte URL **http://localhost:3000/api/login/cliente**, com os seguintes paramêtros no corpo da requisição:
```js
{
    "email": "teste@email.com",
    "password": "1234"
}
```

Caso o retorno da requisição seja **Unauthorized**, a API esta funcionando.

## Instalação da Documentação

 * Abra o terminal, e digite o seguinte comando:
```bash
npm install apidoc -g
```

 * Acesse a pasta do projeto, abra o terminal e execute o comando:
```
npm run gen-doc
```

Ao fazer isso, será gerado uma pasta chamada **apidoc**, e dentro dela há um arquivo HTML chamado **index**, nele contém toda a documentação das rotas do sistema.

## Configurando ambiente do Postman
 
 Dentro da pasta **docFiles**, contém um arquivo chamado **comanda_postman**, basta importar ele no postman que será criado uma coleção de exemplos de requisições.

## Conexões

As configurações de conexão ao MongoDB fica na pasta **config/bd/index.js**:

```js
module.exports = {
    dev: {
        'PORT': 3000,
        'MONGO_HOST': 'localhost',
        'MONGO_PORT': '27017',
        'MONGO_USER': '',
        'MONGO_PWD': '',
        'MONGO_DB': 'comanda',
        'MONGO_AUTH_SOURCE': 'comanda'
    }
    ...
};
```
Já a conexão do firebase fica em **src/conn/firebase**. O arquivo index desta pasta aponta para o caminho do banco, já dentro da pasta **src/conn/firebase/data** contém o arquivo que nos da permissão de acesso (esse arquivo é gerado pelo próprio firebase).
