module.exports = (app) => {
    app.use('/api', require('./user')());
    app.use('/api', require('./cliente')());
    app.use('/api', require('./estabelecimento')());
    app.use('/api', require('./produto')());
    app.use('/api', require('./itemLoja')());
    app.use('/api', require('./desafio')());
    app.use('/api', require('./comanda')());
    app.use('/api', require('./avatar')());
    app.use('/api', require('./correio')());
};