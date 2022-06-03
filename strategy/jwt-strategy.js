const JwtStrategy=require('passport-jwt').Strategy;
const ExtractJwt=require('passport-jwt').ExtractJwt;
const opts={}
const User=require('../models/User');
const cookieExtractor = function (req) {
    let token=req.cookies.token;
    return token;
};
opts.jwtFromRequest=cookieExtractor;
opts.secretOrKey="login$";
module.exports=passport=>
{
    passport.use(new JwtStrategy(opts,(jwt_payload,done)=>
    {
        
        console.log(jwt_payload);
        User.findById(jwt_payload.id)
        .then(person=>
            {
                console.log(person);
                if(person)
                {
                    return done(null,person);
                }
                else
                {
                    return done(null,false);
                }
            })
        .catch(err=>console.log(err));
    }))
}