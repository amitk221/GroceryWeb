const mongoose=require('mongoose');
const ProductSchema=new mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,required:false},
    brand:{type:String,required:false},
    category:{type:String,required:true},
    description:{type:String,required:true},
    numReviews:{type:Number,default:0},
    quantity:{type:Number,required:true,default:0},
    price:{type:Number,required:true,default:0},
    

   
   
   }); 
const CategorySchema=new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true}
})
const Category=mongoose.model("category",CategorySchema);
const Product=mongoose.model('product',ProductSchema);
module.exports={Product,Category};