const doctorModel = require("../models/userModels");
const Patient=require("../models/appointmentModel");
const bcrypt=require("bcrypt");
const axios=require('axios');

function parse_time(t){
  return parseInt(t.substring(0,2))*60+parseInt(t.substring(3,5));
  };

const loginController = async (req, res) => {
 
    
  try {
    const existingUser = await doctorModel.findOne({ email: req.body.email });
   
   
    if (!existingUser) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }
 const isMatch=await bcrypt.compare(req.body.password,existingUser.password);

if(isMatch && existingUser.isAdmin){
  return res.status(200).send({message:'Login Sucessful',success:true});
}

else{
  return res.json({success:false});
}


  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Login Controller ${error.message}`,
      });
  }
};

const appointmentController=async(req,res)=>{
  
  try{
    const{name,email,phone,date,time}=req.body;
    const appointment=new Patient({
      name,email,phone,date,time
    })
    const data=await Patient.find().sort({time:1}).exec();


    cur_time=parse_time(req.body.time);

    collapsed=0

  

    for(let i in data)
    {
        let a=parse_time(data[i].time)
        if((a<=cur_time && cur_time<=a+15) || (a<=cur_time+15 && cur_time<=a))
        collapsed=4      
    }
    
    // Time Before 9

    if(cur_time<540)
      collapsed=1;

      //Time After 7pm
    if(cur_time>1140)
    collapsed=2;


    //Lunch Time
    if(parseInt(req.body.time.substring(0,2))==13 && (cur_time>765 && cur_time<=14*60))
    collapsed=3;

      console.log("collapsed:- ", collapsed);

    if(!collapsed)
    {
      const savedAppointment=await appointment.save();
      res.status(201).json({appointment:savedAppointment});
    }
    else
    {
      res.status(502).json("Time Collapsed");
    }
  }
  catch(error){
    console.log(error.message);
    res.status(500).json({error:'An errror Occurred while booking the appointment'});
  }

}
const get_apos=async(req,res)=>{
try{
  const apos = await Patient.find({});
  res.send(apos);
}catch(error){
  console.log(error);
}
}

const resolve= async (req,res)=>{
    try{
      const id=req.body.id;
      const cur_pat=await Patient.findOne({_id:id})
     
      cur_pat.resolve=true;
      const resp=await cur_pat.save();
      await axios.post('https://doc-app1.onrender.com/schedule_event',resp);
      res.send(resp);
     
    }
  catch(err)
  {
    console.log(err);
  }

}


module.exports = {loginController,appointmentController,get_apos,resolve};