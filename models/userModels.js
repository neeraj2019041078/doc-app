const mongoose=require("mongoose");
const doctorSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,'email is require']
    },
    password:{
        type:String,
        required:[true,'password is require']
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})
const doctorModel=mongoose.model('doctors',doctorSchema);
module.exports=doctorModel;