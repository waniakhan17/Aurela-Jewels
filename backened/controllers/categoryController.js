const Category=require("../models/category");




async function createCategory(req,res){
    try{ 
        let name=req.body.name;
                 ;
        if(!name){
            return res.status(400).json({message:"Category name is required"});
        }
         name=name.trim() 
        const new_name=name.charAt(0).toUpperCase()+name.slice(1).toLowerCase()

        const existingCategory=await Category.findOne({name:new_name});

        if(existingCategory){
            return res.status(400).json({message:"category already exists"});
        }
        const category=new Category({name:new_name});
        await category.save();
        res.status(200).json({message:"category created successfully",category})
    }
    catch(error)
    {
        res.status(500).json({message:"server error",error:error.message});
    }
}

async function getSAllCategories(req,res){
    try{
        const categories=await Category.find({});
        if(categories.length===0){
            return res.status(404).json({message:"no categories found"});
        }                  
        res.status(200).json({categories});
    }
    catch(error){
        res.status(500).json({message:"server error",error:error.message});
    }   
}

module.exports={createCategory,getSAllCategories};