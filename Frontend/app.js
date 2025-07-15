const express=require('express')
const pool=require('./db')
const env=require('dotenv')
const userrouter=require('./Routes/user_routes')
const buisness_router=require('./Routes/Business_routes')
const service_router=require('./Routes/service_routes')
const cors = require("cors");
env.config()

const app=express()
port=5000

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use('/user',userrouter)
app.use('/buisness',buisness_router)
app.use('/service',service_router)
pool.connect((err,client,release)=>{
    if(err){
        console.log(err)
        process.exit(1)
    }
    else{
        console.log("Connected Successfully")
        release();

        app.listen(port,()=>{
        console.log(`Server is running on http://localhost:${port}`)
        })
    }
})

