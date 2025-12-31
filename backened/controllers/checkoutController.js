const Order = require("../models/order");
const Product = require("../models/product");
const Cart = require("../models/cart");

// Checkout and create order

async function checkout(req,res){
    try{

      const cartItems=await  Cart.findOne({sessionId:req.sessionID}).populate('items.productId');
      if(!cartItems || cartItems.items.length===0){
        return res.status(400).json({message:"cart is empty"});
      } 

      const products=cartItems.items.map(item=>({
        productId:item.productId._id,
        quantity:item.quantity,
        price:item.productId.price,
        name:item.productId.name

      })) 

      const totalAmount=products.reduce((total,item)=>total+item.price*item.quantity,0);

      const order=new Order({

        name:req.body.username,
        email:req.body.email,
        address:req.body.shippingAddress,
        phone:req.body.phone,
        products:products,
        totalAmount:totalAmount
      })
        
    await order.save()
//update product stock
for (const item of cartItems.items){
    await Product.findByIdAndUpdate(item.productId._id,{
        $inc:{quantity:-item.quantity}
    })
    const cart=await Cart.findOneAndDelete({sessionId:req.sessionID});
    if(!cart){
        console.log("cart not found for deletion");
}
    res.status(200).json({message:"order placed successfully",order:order }); 

}  
        
    }catch(error){ 
        res.status(500).json({message:"server error",error:error.message});
    }           
}


module.exports = {checkout };