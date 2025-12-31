const {connectDB}=require('./config/db');
const Admin=require('./models/admin');
const bycrypt=require('bcryptjs');

async function createAdmin(){

    await connectDB();

    const name="wajeeha nawaz";
    email="wajeehanawaz123@gmail.com";
    role="admin";
    password="wajeeha@1234";

    const hashedPassword=await bycrypt.hash(password,10);
const admin =new Admin({
    name,
    email,
    role,
    password:hashedPassword
});
await admin.save();
console.log("Admin user created successfully");
process.exit();
}   

createAdmin();
