module.exports = () => {
    const passport = require('passport');
    const JwtStrategy = require('passport-jwt').Strategy;
    const ExtractJwt = require('passport-jwt').ExtractJwt;
    const LocalStrategy = require('passport-local').Strategy;
    const { JWT_SECRET } = require('../../../config');
    const { schemaUser } = require('../../schema/api/usuario');

    require('./cliente')();
    require('./estabelecimento')();

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

    return passport;
};