const Order=require("../models/order");
const { checkout }=require("../controllers/checkoutController");

const router=require('express').Router();

router.post("/",checkout)


module.exports=router;