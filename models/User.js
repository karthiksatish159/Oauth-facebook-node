const mongoose=require('mongoose');
const schema=mongoose.Schema;
const userSchema=new schema(
    {
        username:String,
        FbId:String,
        email:String,
        password:String
    })
module.exports=mongoose.model('User',userSchema);