const Admin = require("../models/Admin");
const Order = require("../models/Order").Order;
const router=require("express").Router();
const jwt = require("jsonwebtoken");

router.get('/',(req,res)=>{
    const token = req.cookies.jwt;
      jwt.verify(token, 'rahulk', async (err, decodedToken) => {
       let admin = await Admin.findById(decodedToken.id);
       if(admin){
          const order = await Order.find({});
          // console.log(order);
          res.render("orders",{title:"Orders",admin:admin,orders:order});
       } else {
         res.redirect();
       }
  });});
  
  router.get('/delete/:ordId',async function(req,res){
    try{
      const token = req.cookies.jwt;
      const decodedToken = await jwt.verify(token,'rahulk');
      const admin = await Admin.findById(decodedToken.id);
      if(admin){
        const orderId = req.params.ordId;
        const delorder = await Order.deleteOne({_id:orderId});
        if(delorder){
          console.log(`Order with OrderId ${orderId} was Deleted`);
          res.redirect("/orders");
        }
      } else{
        console.log("Admin Not found");
        res.redirect("/orders");
      }
    } catch(err) {
        console.log(err);
        res.redirect("/orders");
    }
  });

  router.get('/product/:ordId',async function(req,res){
    try{
      const token = req.cookies.jwt;
      const decodedToken = await jwt.verify(token,'rahulk');
      const admin = await Admin.findById(decodedToken.id);
      if(admin){
        const orderId = req.params.ordId;
        const order = await Order.findById(orderId);
        const orderProducts = order.products;
        res.render("productForEacHOrder",{title: orderId, orderNumber:orderId, products:orderProducts, admin:admin});
      } else{
        console.log("Admin Not found");
        res.redirect("/orders");
      }
    } catch(err) {
      console.log(err);
      res.redirect("/orders");
  }
  });
  
  router.get("/detail/:ordId",async function(req,res){
    try{
      const token = req.cookies.jwt;
      const decodedToken = await jwt.verify(token,'rahulk');
      const admin = await Admin.findById(decodedToken.id);
      if(admin){
        const orderId = req.params.ordId;
        const order = await Order.findById(orderId);
        //const orderProducts = order.products;
        res.render("orderDetail",{title: "Order Detail", orders: order, admin:admin});
      } else{
        console.log("Admin Not found");
        res.redirect("/orders");
      }
    } catch(err) {
      console.log(err);
      res.redirect("/orders");
    }
  });

  router.get('/product/delete/:orderId/:productId', async(req, res) => {
    try{
      const token = req.cookies.jwt;
      const decodedToken = jwt.verify(token,"rahulk");
      const admin = await Admin.findById(decodedToken.id);
      if(admin){
        const orderId = req.params.orderId;
        const productId = req.params.productId;
        const order = Order.findById(orderId);
        if(order){
          const deleteProductFromOrder = order.findByIdAndUpdate(orderId,{$pull:{"products":{_id: productId}}});
          if(deleteProductFromOrder){
            console.log("Product Deleted");
            res.redirect("/orders");
          }else{
            console.log("Product Can't Be deleted");
            res.redirect("/orders");
          }
        }else{
          console.log("Order Not Found");
          res.redirect("/orders");
        }
      }else{
        console.log("Admin Not Found");
        res.redirect("/orders");
      }
    } catch(err) {
      console.log(err);
      res.redirect("/orders");
    }
    // const productId = req.params.id;
    // const deletedProduct = await Product.findByIdAndDelete(productId);
    // if (deletedProduct) {
    //     res.redirect("/products");
    //     console.log("product delted with id", deletedProduct._id);
    // }
});

router.get('/product/update/:orderId/:productId', async(req, res) => {
    const productId = req.params.id;
    const updateProductPage = await Product.findById(productId);

    const token = req.cookies.jwt;
    jwt.verify(token, 'rahulk', async(err, decodedToken) => {
        let admin = await Admin.findById(decodedToken.id);
        const categories = await Category.find({});
        res.render('edit_product', { title: "edit product", admin: admin, products: updateProductPage, categories: categories });
    });


});

router.post('/product/update/:orderId/:productId', async(req, res) => {
    const productId = req.params.id;
    const updateProduct = await Product.findByIdAndUpdate(productId, {
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

  module.exports = router;