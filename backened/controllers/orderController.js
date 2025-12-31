const Order=require("../models/order");


// Update order status (Admin)
async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;       
    const { status } = req.body;     

 
    if (!status ) {
      return res.status(400).json({ message: " missing status" });
    }

    // Update order
    const order = await Order.findByIdAndUpdate(
       orderId,
     {status:status },  
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: `Order status updated to ${status}`, order });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}



//get orders by admin

async function getAllOrders(req,res){
    try{
      const orders=await Order.find();
      if(!orders || orders.length===0){
        return res.send(404).json({message:"no orders found"});
      }
      res.status(200).json({success:true,orders:orders});

    } 
    catch(error){
        res.status(500).json({message:"server error",error:error.message});
}
}


async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params; 
    console.log("orderid",orderId);
    const order = await Order.findByIdAndDelete(orderId);
    console.log(order);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }  

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }

}

module.exports={updateOrderStatus,getAllOrders,deleteOrder};