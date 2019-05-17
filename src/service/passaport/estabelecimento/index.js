module.exports = () => {
        const passport = require('passport'),
            JwtStrategy = require('passport-jwt').Strategy,
            ExtractJwt = require('passport-jwt').ExtractJwt,
            LocalStrategy = require('passport-local').Strategy,
            { JWT_SECRET } = require('../../../../config'),
            { schemaEstabelecimento } = require('../../../schema/api/estabelecimento');

    //JSON WEB TOKENS STRATEGY ESTABELECIMENTO
    passport.use('estabelecimentoAuth', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET
    }, async(payload, done) => {

        try
        {
            if (!payload.auth)
                return done(null, false);

            const estabelecimento = await schemaEstabelecimento.findById(payload.auth._id);

            if(!estabelecimento){
                return done(null, false);
            }

            done(null, { estabelecimentoId: estabelecimento._id });

        }catch(error){
            done(error,false);
        }
    }));

    //ESTABELECIMENTO STRATEGY
    passport.use('estabelecimento', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {

        try
        {
            
            const estabelecimento = await schemaEstabelecimento.findOne({email}, {status: 1, email: 1, password: 1, nome: 1});

            if (!estabelecimento){
                return done(null, null);
            }

            const isMatch = await estabelecimento.isValidPassword(password);

            if (!isMatch){
                return done(null, null);
            }

            done(null, estabelecimento);

        }
        catch(error)
        {
            done(error, false);
        }
    }));

    return passport;
};