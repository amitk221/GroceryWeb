
const express=require('express');
const Product=require('../models/product').Product;
const Category=require('../models/product').Category;
const Admin=require('../models/Admin');
const formidable=require('formidable');
const fs=require('fs');
const router=express.Router();
const jwt = require('jsonwebtoken');


function get_admin(req){
return true;
}


router.get("/products",async(req,res)=>{
    const token = req.cookies.jwt;
    jwt.verify(token, 'rahulk', async (err, decodedToken) => {
     let admin = await Admin.findById(decodedToken.id);


    const products= await Product.find();
    res.render('products',{title:"Products",products:products,admin:admin})

});});
router.post("/products",async(req,res)=>{
  

    console.log(req.body);
 
     const product=new Product({
        name:req.body.product_name,
        price:req.body.product_price,
        category:req.body.product_category,
        image:req.body.image,
        quantity:req.body.product_qt,
        description:req.body.product_description,
        brand:req.body.product_brand,
        admin_id:req.body.admin_id

        
    });
    const newProduct=await product.save();
    if(newProduct){
       
        res.send({message:`new product created ${newProduct.name}`})
    }
    else{
      res.send({message:"Errrore in creating product"})

    }
    
});

router.post("/categories",async(req,res)=>{
   

    console.log(req.body);
 
     const product= new Category({
        name:req.body.category_name,
        
        description:req.body.category_description,
     
        
    });
    const newProduct=await product.save();
    if(newProduct){
       
        res.send({msg:`new Category created ${newProduct.name}`})
    }
    else{
      res.send({msg:"Errrore in creating category"})

    }
    
});
router.get('/product/delete/:id',async (req,res)=>{
    const productId=req.params.id;
  const deletedProduct=await Product.findByIdAndDelete(productId);
  if(deletedProduct){
      res.redirect("/products");
      console.log("product delted with id",deletedProduct._id);
  }
});
router.get('/category/delete/:id',async (req,res)=>{
    const categoryId=req.params.id;
  const deletedcategory=await Category.findByIdAndDelete(categoryId);
  if(deletedcategory){
      res.redirect("/categories");
      console.log("category delted with id",deletedcategory._id);
  }
});

router.get('/add_product', async(req,res)=>{

    const token = req.cookies.jwt;
    jwt.verify(token, 'rahulk', async (err, decodedToken) => {
     let admin = await Admin.findById(decodedToken.id);
     const categories=await Category.find({});
    res.render('add_product',{title:"add product",admin:admin,categories:categories});
  });
   
  });
 
  router.get("/categories",async(req,res)=>{
    const token = req.cookies.jwt;
    jwt.verify(token, 'rahulk', async (err, decodedToken) => {
     let admin = await Admin.findById(decodedToken.id);

    const categories= await Category.find();
    
    res.render('categories',{title:"Categories",categories:categories,admin:admin})
    });
});
 
module.exports=router;