const express=require('express');
const app=express();
const port=process.env.PORT|3000;
const passport=require('passport');
const auth=require('./routes/public/auth');
const path=require('path')
const session=require('express-session')
const fs=require('fs')
const https=require('https');
const mongoose=require('mongoose');
const db=require('./config/myUrls').mongoDBUri;
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(session({secret:"This fb"}));
app.set('view engine','ejs');


app.use('/auth',auth);
app.use(passport.initialize())
require('./strategy/facebook-strat')(passport)
require("./strategy/jwt-strategy")(passport);

passport.serializeUser(function(user,done)
{
    done(null,user);
})
passport.deserializeUser(function(id,done)
{
    return done(null,id);
})
mongoose.connect(db,{useNewUrlParser:true})
.then(()=>console.log('mongo connected'))
.catch((err)=>console.log(err));
app.get('/',(req,res)=>
{
    res.render('index');
})
const sslServer=https.createServer(
    {
        key:fs.readFileSync(path.join(__dirname,'cert','key.pem')),
        cert:fs.readFileSync(path.join(__dirname,'cert','cert.pem'))
    },app)
sslServer.listen(port,()=>console.log(`Server is running with https on ${port}`));
// app.listen(port,()=>{console.log(`Port is running on ${port}`)});