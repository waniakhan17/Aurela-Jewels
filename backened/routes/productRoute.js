const router = require('express').Router();
const upload=require("../middleware/upload");
const adminAuth=require("../middleware/adminauth");

const { createProduct, getAllProducts, getProductById, getProductsBySearch,deleteProduct } = require("../controllers/productController");


router.post("/create-products",adminAuth,upload.single("image"), createProduct);

router.get("/", getAllProducts);

router.get("/search", getProductsBySearch);
router.get("/:productId", getProductById);
router.delete("/:productId",adminAuth,deleteProduct);
module.exports = router;