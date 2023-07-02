const express = require("express");
const path = require("path");
const dotenv =require("dotenv");
const connectDB=require("./config/db");
const cors=require("cors");
const {google} = require('googleapis');
const { OAuth2 } =require("googleapis/build/src/apis/oauth2");
const {axios}=require("axios");
const dayjs=require("dayjs");

const calendar=google.calendar({
  version:"v3",
  auth:process.env.API_KEY,
})

const port=process.env.PORT || 8080;

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
connectDB();

const Oauth2Client=new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
)
const scopes=[
  'https://www.googleapis.com/auth/calendar'
]
const token="";

app.use(express.static(path.join(__dirname,"./build")));
app.use("/api/v1/user",require("./routes/userRoutes"));

app.get("/google",(req,res)=>{
  const url=Oauth2Client.generateAuthUrl({
    access_type:"offline",
    scope:scopes
  });
  
  res.redirect(url);
});


app.get("/google/redirect",async(req,res)=>{
 const code=req.query.code;
 const {tokens} = await Oauth2Client.getToken(code)
 Oauth2Client.setCredentials(tokens);
  res.send({
    msg:"you have sucessfully logged in"
  });
});

app.post("/schedule_event",async(req,res)=>{
 
 
 const result = await calendar.events.insert({
    calendarId:"primary",
    auth:Oauth2Client,
    requestBody:{
      summary:`Appointment is scheduled for ${req.body.name} ${req.body.email}`,
      description:`${req.body.phone}`,
      start:{
        dateTime:dayjs(new Date()).add(1,"day").toISOString(),
        timeZone:"Asia/Kolkata",
      
    },
    end:{
      dateTime:dayjs(new Date()).add(1,"day").add(1,"hour").toISOString(),
      timeZone:"Asia/Kolkata",

    },
  }
});
res.send({
  msg:"Done"
})

})
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});