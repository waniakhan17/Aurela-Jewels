const mongoose=require("mongoose")

const orderSchema=new mongoose.Schema(
    {
        name:{type:String,required :true},
        email:{type:String,required:true},
        address:{type:String,required:true},
        phone:{type:String,required:true},
        products:[
            {
                productId:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
                quantity:{type:Number,required:true},
                price:{type:Number,required:true},
                name:{type:String,required:true}
                
            }
        ],
        totalAmount:{type:Number,required:true},
        orderDate:{type:Date,default:Date.now},
        status:{type:String,enum: ["Pending", "Shipped", "Delivered", "Cancelled"],default:"Pending"
        }

    }


)
module.exports=mongoose.model("Order",orderSchema);