const mongoose=require('mongoose');
require("dotenv").config();

 async function connectDB(){
    console.log(`url is ${process.env.mongo_url}`);
try{
   const conn=await mongoose.connect(process.env.mongo_url);

   console.log(`mongodb connected: ${conn.connection.host}`);
}catch(err)
{
    console.log(`error in db connection ${err}}`);
    return;
}
 
 }
 module.exports={connectDB}


