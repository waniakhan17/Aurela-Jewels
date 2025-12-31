const express = require("express");
const app = express();
const path=require("path")
const port = 5000;
const {
  getProducts,
  getProductId,
  getProductName,
  getCartItems,
  getCategories,
  getOrders,
} = require("./utils/api");

const {paginate}=require("./utils/pagination")
const adminAuth = require("../backened/middleware/adminauth.js");
// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Static files
app.use(express.static("public"));

// Home route
app.get("/", async (req, res) => {
  try {
    const products = await getProducts();
    res.render("index", {
      title: "Aurela Jewels",
      products: products,
    });
  } catch (err) {
    console.error("Error fetching products for home page:", err);
    res.status(500).send("Internal Server Error");
  }
});


// Product listings per page
app.get("/products", async (req, res) => {
  try {
    const products=await getProducts()
    const result=paginate(products,req.query.page,12)
    res.render("product", {
      title: "Aurela Jewels",
      products: result.paginatedItems,
      currentPage: result.currentPage,
      totalPages:result.totalPages,
    });
  } catch (err) {
    console.error("Error fetching products for /products:", err);
    res.status(500).send("Internal Server Error");
  }
});


//product search
app.get("/products/search", async (req, res) => {
  const searchQuery = req.query.search || '';

  try {
    const products = await getProductName(searchQuery);
    const result=paginate(products,req.query.page,8)
    res.render("product", {
      title: "Aurela Jewels",
      products: result.paginatedItems,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      searchQuery
    });

  } catch (err) {
    console.error("Error in /products/search route:", err);
    res.render("product", {
      title: "Aurela Jewels",
      products: [],
      searchQuery,
      currentPage: 1,
      totalPages: 1
    });
  }
});


//product id and display details
app.get("/product/:id", async (req, res) => {
  try {
    const productId=req.params.id;
    const product = await getProductId(productId);
    if (!product) {
            return res.status(404).send("Product not found");
     }
    res.render("productDetails", {
      title: product.name,
      product,
    });
  } catch (err) {
     console.error(err);
        res.status(500).send("Server error");
  }
});

//about route
app.get("/about",(req,res)=>{
  res.render("about",{
    title:"Aurela Jewels"
  })
})


//checkout route
app.get("/checkout",(req,res)=>{
  res.render("checkout",{
    title:"Aurela Jewels"
  })
})


//cart route
app.get("/cart", async (req, res) => {
  try {
    const items = await getCartItems(req); // items from DB or session
    console.log("Items received from backend:", items);

    // Calculate subtotal dynamically
    let subtotal = 0;
    items.forEach(item => {
      const price = Number(item.productId?.price) || 0;
      const qty = Number(item.quantity) || 0;
      subtotal += price * qty+300;
    });

    res.render("cart", {
      title: "Aurela Jewels",
      items,       // pass raw items
      subtotal,    // initial subtotal
      total: subtotal // initial total
    });
  } catch (err) {
    console.error("Render Error:", err);
    res.render("cart", { title: "Aurela Jewels", items: [], subtotal: 0, total: 0 });
  }
});


app.get("/admin", (req, res) => {
    res.render("admin/login", { title: "Login" });
});
app.get("/admin/dashboard", (req, res) => {
    res.render("admin/dashboard", { title: "Dashboard" });
});

app.get("/admin/orders",async(req,res)=>{
  try{
    const data = await getOrders();
    const orders=data||[];

    res.render("admin/orders", {
      title: "Orders",
      orders
    });
  }catch(err){
console.error("Orders error:", err);
    res.status(500).send("Admin Error");
  }
})

app.get("/admin/products",async(req,res)=>{
  try{
    const categories = await getCategories();
    const products=await getProducts();
    res.render("admin/products",{
      title:"Products",
      products,
      categories
    })
  }catch(err){
console.error("Products error:", err);
    res.status(500).send("Admin Error");
  }
})

app.get("/admin/categories",async(req,res)=>{
  try{
    const categories = await getCategories();
    res.render("admin/categories",{
      title:"Categories",
      categories
    })
  }catch(err){
console.error("Admin dashboard error:", err);
    res.status(500).send("Admin Error");
  }
})


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
