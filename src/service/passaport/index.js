module.exports = () => {
    const passport = require('passport');
    const JwtStrategy = require('passport-jwt').Strategy;
    const ExtractJwt = require('passport-jwt').ExtractJwt;
    const LocalStrategy = require('passport-local').Strategy;
    const { JWT_SECRET } = require('../../../config');
    const { schemaUser } = require('../../schema/api/user');
    const { schemaCliente } = require('../../schema/api/cliente');
    const { schemaEstabelecimento } = require('../../schema/api/estabelecimento');


    //JSON WEB TOKENS STRATEGY
    passport.use('usuarioAuth', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: JWT_SECRET
    }, async(payload, done) => {
        try{
            // Find the user specified in token
            const user = await schemaUser.findById(payload.user._id);

            //If user doesn't exists, handle it
            if(!user){
                return done(null, false);
            }

            // Otherwise, return the user
            done(null, user);
        }catch(error){
            done(error,false);
        }
    }));

    //LOCAL STRATEGY
    passport.use('usuario', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try{
            // Find the user given the email
            const user = await schemaUser.findOne({email});

            // If not, handle it
            if (!user){
                return done(null, {msg: 'NO_FOUND_USER'});
            }

            // Check if the password is corret
            const isMatch = await user.isValidPassword(password);

            // If not, handle it
            if (!isMatch)
                return done(null, false);

            // Otherwise, return the user
            done(null, user);
        }catch(error){
            done(error, false);
        }
    }));




    //--------------------------------------------------------------------------------------------------------

    //JSON WEB TOKENS STRATEGY CLIENTE
    passport.use('clienteAuth', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: JWT_SECRET
    }, async(payload,done) => {

        try{
            if (!payload.user)
                return done(null, false);

            // Find the user specified in token
            const cliente = await schemaCliente.findById(payload.user._id);

            //If user doesn't exists, handle it
            if(!cliente){
                return done(null, false);
            }

            // Otherwise, return the user
            done(null, cliente);
        }catch(error){
            done(error,false);
        }
    }));

    //CLIENTE STRATEGY
    passport.use('cliente', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try{
            // Find the user given the email
            const cliente = await schemaCliente.findOne({email});

            // If not, handle it
            if (!cliente){
                return done(null, {msg: 'NO_FOUND_USER'});
            }

            // Check if the password is corret
            const isMatch = await cliente.isValidPassword(password);

            // If not, handle it
            if (!isMatch){
                return done(null, {msg: 'NO_FOUND_USER'});
            }

            // Otherwise, return the cliente
            done(null, cliente);

        }catch(error){
            done(error, false);
        }
    }));




    //ESTABELECIMENTO
    //--------------------------------------------------------------------------------------------------------

    //JSON WEB TOKENS STRATEGY ESTABELECIMENTO
    passport.use('estabelecimentoAuth', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: JWT_SECRET
    }, async(payload,done) => {
        try{
            // Find the user specified in token
            const estabelecimento = await schemaEstabelecimento.findById(payload.estabelecimento._id);

            //If user doesn't exists, handle it
            if(!estabelecimento){
                return done(null, false);
            }

            // Otherwise, return the user
            done(null, estabelecimento);
        }catch(error){
            done(error,false);
        }
    }));

    //ESTABELECIMENTO STRATEGY
    passport.use('estabelecimento', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try{
            // Find the user given the email
            const estabelecimento = await schemaEstabelecimento.findOne({email}, {status: 1, email: 1, password: 1, nome: 1});

            // If not, handle it
            if (!estabelecimento){
                return done(null, {msg: 'NO_FOUND_USER'});
            }

            // Check if the password is corret
            const isMatch = await estabelecimento.isValidPassword(password);

            // If not, handle it
            if (!isMatch){
                return done(null, {msg: 'NO_FOUND_USER'});
            }

            // Otherwise, return the estabelecimento
            done(null, estabelecimento);

        }catch(error){
            done(error, false);
        }
    }));

    return passport;
};