
const cors= require("cors");
const express = require("express");
require("dotenv").config();
const session = require("express-session");
const { connectDB } = require("./config/db");
const cookieParser = require("cookie-parser");
const path = require("path");




(async function startServer() {
  try {
    // 1️⃣ Connect to database
    await connectDB();
    console.log("Database connected successfully!");

    const app = express();
    app.use(cors( {
        origin:"http://localhost:5000",
      credentials:true,
      methods:["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      }));
    app.use(cookieParser());
    app.use(express.json());
    // 2️⃣ Session setup
    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { 
          httpOnly:true,
          secure:false,
          sameSite:"lax",
          maxAge: 1000 * 60 * 60 * 24 
        }
      })
    );

    // 3️⃣ Static folder
    // app.use('/JewelryImages', express.static('JewelryImages'));

    app.use(
  "/JewelryImages",
  express.static(path.join(__dirname, "JewelryImages"))
);
console.log("images", __dirname);

    // 4️⃣ Routes
    const categoryRoute = require("./routes/categoryRoute");
    const producRoute = require("./routes/productRoute");
    const checkoutRoute = require("./routes/checkoutRoute");
    const cartRoute = require("./routes/cartRoute");
    const orderRoute = require("./routes/orderRoute");
    const adminRoute = require("./routes/adminRoute");

    app.use("/cart", cartRoute);
    app.use("/products", producRoute);
    app.use("/category", categoryRoute);
    app.use("/checkout", checkoutRoute);
    app.use("/orders", orderRoute);

    app.use("/admin", adminRoute);

    // 5️⃣ Start server
    const port = 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port} http://localhost:${port}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
