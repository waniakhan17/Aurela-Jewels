const router=require("express").Router();


const { addToCart, getCart, updateCartItem, removeCartItem } = require("../controllers/cartController");

router.post("/", addToCart);
router.get("/", getCart);
router.patch("/:productId", updateCartItem);
router.delete("/:productId", removeCartItem);

module.exports=router;