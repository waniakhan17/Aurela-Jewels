const Product = require("../models/product");
const Category = require("../models/category");

async function getAllProducts(req, res) {
    try {
        const products = await Product.find().populate("category");
        res.status(200).json({ success: true, count: products.length, products })


    } catch (error) {
        res.status(500).json({ message: "server error:,error:error.message" });
    }
}


async function createProduct(req, res) {
    try {
        const { name, quantity, description, category, price} = req.body;
        if (!name || !quantity || !description || !category || !price ) {                               
            return res.status(400).json({ message: "All fields are required" })
        }
        if(!req.file){
            return res.status(400).json({ message: "Image is required" })
        }


         let categoryDoc = await Category.findOne({ name: category });
       
    if (!categoryDoc) {
        return res.status(400).json({ message: "Invalid category" });
    }

    const imagePath=`${category}/${req.file.filename}`;
        const product = new Product({ name, quantity, description, category, price, image:imagePath ,category:categoryDoc._id});
        await product.save();
        res.status(200).json({ message: "product created successfully", product })
    } catch (error) {
        res.status(500).json({ message: "server error",error:error.message});
    }
}






async function getProductsBySearch(req, res) {
  try {
    const { search } = req.query;

    if (!search || search.trim() === "") {
      return res.status(400).json({ message: "Search value is required" });
    }

    const trimmedSearch = search.trim();
    const words = trimmedSearch.split(/\s+/);

    let matchStage;

    if (words.length === 1) {
      // Single-word search → exact match on category only
      matchStage = {
        "category.name": { $regex: `^${words[0]}$`, $options: "i" }
      };
    } else {
      // Multi-word search → match product name
      const namePattern = words.join(".*");
      matchStage = {
        name: { $regex: namePattern, $options: "i" }
      };
    }

    const products = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      { $match: matchStage }
    ]);

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({ success: true, products });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}






async function getProductById(req, res) {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId).populate("category");
        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }
        res.status(200).json({ success: true, product })
    } catch (error) {
        res.status(500).json({ message: "server error",error:error.message });
    }
}


async function deleteProduct(req, res) {
    try {
        const { productId } = req.params;   
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
  }


module.exports = { createProduct, getAllProducts, getProductById, getProductsBySearch ,deleteProduct};