
const Cart = require("../models/cart");


// Add item to cart


async function addToCart(req, res) {
     try {
    const sessionId = req.sessionID;

    const { productId, quantity } = req.body;

    if(!sessionId||!quantity){
        return res.status(400).json({ message: "Product ID and quantity are required" });
    }   

        let cart = await Cart.findOne({sessionId});
        if (!cart) {
            cart = new Cart({ sessionId, items: [] });
        }   
        cart.items.push({productId, quantity});
        await cart.save();
        res.status(201).json({ message: "Item added to cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }       

}   


async function getCart(req, res) {
    try {   
        const sessionId = req.sessionID;
        const cart = await Cart.findOne({ sessionId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }       
}


async function updateCartItem(req, res) {
    try {   
        const sessionId = req.sessionID;
        console.log("SESSION ID:", req.sessionID);

        const { productId } = req.params;
        const { quantity} = req.body;
        const cart = await Cart.findOne({ sessionId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        console.log("Cart items:", cart.items.map(i => i.productId.toString()));
console.log("ItemId from request:", productId);

        const itemIndex = cart.items.findIndex(item => item.productId.toString() == productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.status(200).json({ message: "Item updated successfully", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }   
}

async function removeCartItem(req, res) {
    try {
        const sessionId = req.sessionID;
        const { productId } = req.params;
        const cart = await Cart.findOne({ sessionId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }   
        const itemIndex=cart.items.findIndex(item=>item.productId.toString()===productId);
        if(itemIndex===-1){
            return res.status(404).json({message:"Item not found in cart"});
        }   
        cart.items.splice(itemIndex,1);
        await cart.save();
        res.status(200).json({message:"Item removed successfully",cart});
    } catch (error) {           
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
module.exports={addToCart,getCart,updateCartItem,removeCartItem};