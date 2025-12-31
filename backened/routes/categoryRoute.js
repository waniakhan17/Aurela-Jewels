const router = require('express').Router();

const { createCategory ,getSAllCategories} = require("../controllers/categoryController");
const adminAuth=require("../middleware/adminauth");

router.get("/",getSAllCategories);
router.post("/create-category", adminAuth, createCategory);
module.exports = router;