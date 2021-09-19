const mongoose=require('mongoose');
const ProductSchema=new mongoose.Schema({
  productId:{type:String},
  orderId:{type:String},
  productQuantity:{type:String}
}); 