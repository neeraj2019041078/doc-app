const mongoose=require("mongoose");

const connectDB=async()=>{
try{
    const conn=await mongoose.connect(process.env.MONGO_URL,{
        useUnifiedTopology:true,
        useNewUrlParser:true
    })
    console.log(`mongo database is connected ${conn.connection.host}`);
}
catch(error){
    console.log(error);
    process.exit(1);
}
}
module.exports=connectDB;