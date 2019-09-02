# API - Comanda Gameficada

## Introdução
Esta é a API do projeto **Comanda Gameficada**, esta API é utilizada no aplicativo Mobile e no Portal.

## Preparação

Antes de iniciar, é necessário instalar o [node](http://nodejs.org/), o [git](https://git-scm.com/) e o [MongoDB](https://www.mongodb.com/download-center/community) localmente.


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
  <img src="https://uploaddeimagens.com.br/imagens/fluxo_api-png-23e1f9e2-f9bc-46c2-b2d0-9573080a2a67">
</p>

## Getting started
 
 * Go to the folder you installed MongoDB and run the mongod.exe file.

 * Open CMD and execute:
```bash
# clone the project - when cloning the project it will automatically create a folder named crud_nodejs
git clone https://github.com/vitorric/crud_nodejs.git
```
 * Access the folder crud_nodejs, open CMD and execute:
```bash
# install project dependencies
npm install

# install nodemon to start project
npm install -g nodemon

# start project
nodemon
```

Open your browser and enter the URL [http://localhost:3000](http://localhost:3000)

## Connections

Open the **config/bd/index.js** folder, you will see the following JSON:

```js
module.exports = {
    dev: {
        'MONGO_HOST': '127.0.0.1',
        'MONGO_PORT': '27017',
        'MONGO_USER': '',
        'MONGO_PWD': '',
        'MONGO_DB': 'yourDB',
        'MONGO_AUTH_SOURCE': ''
    },
    homolog: {
        'MONGO_HOST': 'ds341825.mlab.com',
        'MONGO_PORT': 41825,
        'MONGO_DB': 'syscompany',
        'MONGO_USER': 'syscompany',
        'MONGO_PWD': 'nahXZB7aGZ4.T<eK'
    }
    ...
};
```

You can configure multiple environments, and to connect to one, just go to the file **src/connection/index.js** and search for the line:

```js
let dbPrincipal = 'dev';
```

If you change the value of dbPrincipal to homolog, you will get data from a database in mLab. The data inserted in mLab is a json called **company.json**, you can get it in root of project.

Or, you can change the value **'dev'** to your new environment.

## Demonstration
