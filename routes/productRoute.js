
const express = require('express');
const Product = require('../models/product').Product;
const Banner = require('../models/product').Banner;
const Category = require('../models/product').Category;
const Admin = require('../models/Admin');
const formidable = require('formidable');
const fs = require('fs');
const router = express.Router();
const jwt = require('jsonwebtoken');




// ********************REading excel file *********************



function get_admin(req) {
  return true;
}

// *******************************FOR products
router.get("/products", async (req, res) => {
  const token = req.cookies.jwt;
  jwt.verify(token, 'rahulk', async (err, decodedToken) => {
    let admin = await Admin.findById(decodedToken.id);


    const products = await Product.find();
    res.render('products', { title: "Products", products: products, admin: admin })

  });
});

router.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json({ title: "Products", products: products })
});

router.post("/products", async (req, res) => {


  console.log(req.body);

  const product = new Product({
    name: req.body.product_name,
    price: req.body.product_price,
    category_id: req.body.product_category,
    product_image_1: req.body.product_image_1,
    product_image_2: req.body.product_image_2,
    quantity: req.body.product_qt,
    description: req.body.product_description,
    brand: req.body.product_brand,
    unit: req.body.unit


  });
  const newProduct = await product.save();
  if (newProduct) {

    res.send({ message: `new product created ${newProduct.name}` })
  }
  else {
    res.send({ message: "Errrore in creating product" })

  }

});

router.get('/add_product', async (req, res) => {

  const token = req.cookies.jwt;
  jwt.verify(token, 'rahulk', async (err, decodedToken) => {
    let admin = await Admin.findById(decodedToken.id);
    const categories = await Category.find({});
    res.render('add_product', { title: "add product", admin: admin, categories: categories });
  });

});

router.get('/product/delete/:id', async (req, res) => {
  const productId = req.params.id;
  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (deletedProduct) {
    res.redirect("/products");
    console.log("product delted with id", deletedProduct._id);
  }
});

router.get('/product/update/:id', async (req, res) => {
  const productId = req.params.id;
  const updateProductPage = await Product.findById(productId);

  const token = req.cookies.jwt;
  jwt.verify(token, 'rahulk', async (err, decodedToken) => {
    let admin = await Admin.findById(decodedToken.id);
    const categories = await Category.find({});
    res.render('edit_product', { title: "edit product", admin: admin, products: updateProductPage, categories: categories });
  });


});

router.post('/product/update/:id', async (req, res) => {
  const productId = req.params.id;
  const updateProduct = await Product.findByIdAndUpdate(productId,
    {
      description: req.body.description,
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      quantity: req.body.quantity,
      product_image_2: req.body.product_image_2,
      product_image_1: req.body.product_image_1,
      brand: req.body.brand,
      unit: req.body.unit
    });
  if (updateProduct) {
    res.redirect("/products");
    console.log("product updated with id", updateProduct._id);
  }
});
// *******************************FOR categories
router.post("/categories", async (req, res) => {


  console.log(req.body);

  const category = new Category({
    name: req.body.category_name,

    description: req.body.category_description,
    image: req.body.image


  });
  const new_Cate = await category.save();
  if (new_Cate) {

    res.send({ msg: `new Category created ${new_Cate.name}` })
  }
  else {
    res.send({ msg: "Errrore in creating category" })

  }

});
router.get('/add_category', (req, res) => {
  const token = req.cookies.jwt;
  jwt.verify(token, 'rahulk', async (err, decodedToken) => {
    let admin = await Admin.findById(decodedToken.id);

    res.render('add_category', { admin: admin, title: "Dashboard" })
  });
});
router.get('/category/delete/:id', async (req, res) => {
  const categoryId = req.params.id;
  const deletedcategory = await Category.findByIdAndDelete(categoryId);
  if (deletedcategory) {
    res.redirect("/categories");
    console.log("category delted with id", deletedcategory._id);
  }
});



router.get("/categories", async (req, res) => {
  const token = req.cookies.jwt;
  jwt.verify(token, 'rahulk', async (err, decodedToken) => {
    let admin = await Admin.findById(decodedToken.id);

    const categories = await Category.find();

    res.render('categories', { title: "Categories", categories: categories, admin: admin })
  });
});









//***************** * FOR BANNERS/


router.get("/add_banner", async (req, res) => {
  const token = req.cookies.jwt;
  jwt.verify(token, 'rahulk', async (err, decodedToken) => {
    let admin = await Admin.findById(decodedToken.id);



    res.render('add_banner', { title: "Create Banner", admin: admin })
  });
});

router.post("/add_banner", async (req, res) => {
  const token = req.cookies.jwt;
  jwt.verify(token, 'rahulk', async (err, decodedToken) => {
    let admin = await Admin.findById(decodedToken.id);
    console.log(req.body);
    const newBanner = new Banner({
      title:req.body.title,
      description:req.body.description,
      image:req.body.image,
      redirect:req.body.redirect});
   newBanner.save().then(respo=>{ console.log(respo);
    res.json({msg:"banner created"});});
   

  });
});


router.get("/banner", async (req, res) => {
  const token = req.cookies.jwt;
  jwt.verify(token, 'rahulk', async (err, decodedToken) => {
    let admin = await Admin.findById(decodedToken.id);

    const All = await Banner.find();
   console.log(All)
    res.render('banner', { title: "Banners", banner: All, admin: admin })
  });
});



router.get('/banner/delete/:id', async (req, res) => {
  const bannerId = req.params.id;
  const deletedbanner = await Banner.findByIdAndDelete(bannerId);
  if (deletedbanner) {
    res.redirect("/banner");
    console.log("banner delted with id", deletedbanner._id);
  }
});




module.exports = router;