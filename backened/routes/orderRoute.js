
const router=require('express').Router();
const { getAllOrders, updateOrderStatus,deleteOrder}=require("../controllers/orderController");
const adminAuth=require("../middleware/adminauth");


router.get("/", getAllOrders);
router.patch("/:orderId", adminAuth,updateOrderStatus);
router.delete("/:orderId",adminAuth, deleteOrder);
module.exports=router;