
const router=require("express").Router();

router.get('/orders',(req,res)=>{
    const token = req.cookies.jwt;
      jwt.verify(token, 'rahulk', async (err, decodedToken) => {
       let admin = await Admin.findById(decodedToken.id);
     
    res.render('orders',{admin:admin,title:"Dashboard"})
  });});
  

  module.exports=router;