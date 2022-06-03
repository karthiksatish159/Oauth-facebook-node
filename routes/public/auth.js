const passport=require('passport')
const getIP = require('ipware')().get_ip;
const router=require('express').Router();
var requestIp = require('request-ip');
const User=require('../../models/User');
const jwt=require('jsonwebtoken');
const sessionStorage = require('sessionstorage-for-nodejs');
router.get('/login',(req,res)=>
{
    res.send('index')
})
//Normal authectication
router.post('/verify',(req,res)=>
{
    User.findOne({email:req.email})
    .then((person)=>
    {
        if(person)
        {
            bcrypt.compare(req.body.password,person.password)
            .then(
                value=>
                {
                    console.log(value)
                    if(value)
                    {
                        console.log("dadasdad");
                        const payload={
                            id:person.id,
                            email:person.email
                        }
                        jwt.sign(
                            payload,
                            key,
                            {expiresIn:3600},
                            (err,token)=>
                            {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                  
                                    res.cookie('token',token)
                                    return res.render('home');
                                }
                            }

                        )
                    }
                }).catch(err=>console.log(err))
        }
        else
        {
                return res.redirect('/');
        }
    })
    .catch(err=>console.log(err))
})
router.get('/facebook',passport.authenticate('facebook',{scope:'email'}))
router.get('/facebook/callback',passport.authenticate('facebook'),(req,res)=>
{

         var ip = req.socket.remoteAddress
         var clientIp = requestIp.getClientIp(req);
      
        User.findOne({FbId:req.user.id})
        .then((person)=>
        {
           
                if(person)
                {
                    const payload={
                        id:person._id,
                        Fb:person.FbId
                    }
                    const key="login$";
                    jwt.sign(
                        payload,
                        key,
                        {expiresIn:3600},
                        (err,token)=>
                        {
                            if(err)
                            {
                                console.log(err);

                            }
                            else
                            {
                                 res.cookie("token",token);
                                return res.render("home",{user:req.user,Ip:clientIp});
                            }
                        }
            
                    )
                }
        })
        .catch((err)=>console.log(err));
})
router.get('/holoworld',passport.authenticate('jwt',{session:false}),(req,res)=>
{
    //console.log(req);
    return res.render('holoworld');
})
module.exports=router;
