const FacebookStrategy=require('passport-facebook');
const User=require('../models/User');
const bcrypt=require('bcryptjs')
opts=
{
    clientID: 1492165954578831,
    clientSecret: 'e709f6a46aa04a32d8c448eb2ef4d441',
    callbackURL: "https://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
    // ,'user_mobile_phone'
}
module.exports=passport=>{passport.use(new FacebookStrategy(opts,
 (accessToken,RefershToken,profile,done)=>
{
//   console.log(profile);
  User.findOne({username:profile.displayName})
  .then((user)=>
  {

      if(user)
      {
          console.log('User already existed');
      }
      else
      {
          let ee=null;
          ee=profile.emails[0].value;
         const newUser= new User(
              {
                  username:profile.displayName,
                  FbId:profile.id,
                  email:ee,
                  password:'Fb123'
              })
              bcrypt.genSalt(10,(err,slat)=>
              {
                bcrypt.hash(newUser.password,slat,(err,hash)=>
                {
                    if(err)
                            {
                                res.redirect("/");
                            }
                            else
                            {
                                newUser.password=hash;
                                newUser.save()
                                .then((newUser)=>{console.log(`User was succesfully saved`)})
                                .catch((err)=>console.log(err))
                            }
                })
              })

      }
  })
  .catch((err)=>console.log(err));
  return done(null,profile);
}))};
