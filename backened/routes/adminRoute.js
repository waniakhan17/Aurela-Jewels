const router=require("express").Router();
const {adminLogin}=require("../controllers/adminController");

router.post("/login",adminLogin);

module.exports=router;