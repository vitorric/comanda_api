module.exports = (app) => {
    app.use('/api', require('./cliente')());
    app.use('/api', require('./clienteEstabelecimento')());
    app.use('/api', require('./estabelecimento')());
    app.use('/api', require('./produto')());
    app.use('/api', require('./itemLoja')());
    app.use('/api', require('./desafio')());
    app.use('/api', require('./comanda')());
    app.use('/api', require('./avatar')());
    app.use('/api', require('./correio')());
    app.use('/api', require('./uploadFiles')());
    app.use('/api', require('./gps')());
};