module.exports = () => {
    const passport = require('passport'),
        JwtStrategy = require('passport-jwt').Strategy,
        ExtractJwt = require('passport-jwt').ExtractJwt,
        LocalStrategy = require('passport-local').Strategy,
        { JWT_SECRET } = require('../../../../config'),
        { schemaCliente } = require('../../../schema/api/cliente');

    passport.use('clienteAuth', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET
    }, async(payload,done) => {

        try{
            if (!payload.auth)
                return done(null, false);

            const cliente = await schemaCliente.findById(payload.auth._id);

            if(!cliente){
                return done(null, false);
            }

            // Otherwise, return the user
            done(null, {clienteId: cliente._id, apelido: cliente.apelido, avatarId: cliente.avatar._id });
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
                return done(null, null);
            }

            // Check if the password is corret
            const isMatch = await cliente.isValidPassword(password);

            // If not, handle it
            if (!isMatch){
                return done(null, null);
            }

            // Otherwise, return the cliente
            done(null, cliente._id);

        }catch(error){
            done(error, false);
        }
    }));

    return passport;
};