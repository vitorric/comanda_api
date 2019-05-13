module.exports = () => {
    const passport = require('passport'),
        JwtStrategy = require('passport-jwt').Strategy,
        ExtractJwt = require('passport-jwt').ExtractJwt,
        LocalStrategy = require('passport-local').Strategy,
        { JWT_SECRET } = require('../../../config'),
        { schemaCliente } = require('../../../schema/api/cliente');

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

    return passport;
};