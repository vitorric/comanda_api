module.exports = (app) => {

    app.use('/api', require('./api/user')());
    app.use('/api', require('./api/cliente')());
    app.use('/api', require('./api/estabelecimento')());
    app.use('/api', require('./api/produto')());
    app.use('/api', require('./api/itemLoja')());
    app.use('/api', require('./api/conquista')());
    app.use('/api', require('./api/comanda')());
    app.use('/api', require('./api/avatar')());
    
};