var nodemailer = require('nodemailer');
const express=require('express');
const myemail = require('../config/config').myemail;
const mypassword = require('../config/config').mypassword;
const Admin=require('../models/Admin');

const router=express.Router();
const jwt = require('jsonwebtoken');

router.get('/forget_pass',async(req,res)=>{
  
  res.render('forget');
});
router.post('/forget_pass',async(req,res)=>{
  const email=req.body.email;
  console.log(email);
   const admin=await Admin.find({email:email});
   
   
   if(admin[0]){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: myemail,
          pass: mypassword
        }
      });
      
      var mailOptions = {
        from: myemail,
        to: email,
        subject: 'forget password for login',
        html: '   <div style="height: 100vh;padding: 10px;background-color:rgb(236, 230, 230)"><h1 style="color: rgb(14, 14, 22);font-family: fantasty;text-center"> set your new password</h1><div style="display: flex;justify-content: center;padding:200px;"><a href="http://localhost:3000/update_pass/'+admin[0]._id+'" style="text-decoration: none;background-color: blue;padding: 20px;color: white;font-weight: bold;">click here</a></div></div>'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.send({msg:"check your email"});
        }
      });
   }
   else{
       res.send({msg:'this email does not exist in our record :('});
   }
});

router.get('/update_pass/:id',async(req,res)=>{
  const id=req.params.id;
  const admin=await Admin.findById(id);
  
  console.log(admin);
  res.render('update_pass',{admin:admin})
});
router.post('/update_pass',async(req,res)=>{
  const email=req.body.email;
  console.log(req.body);
  const password=req.body.password;
  const admin=await Admin.find({email:email});
  const newadmin=await Admin.findById(admin[0]._id);
  newAdmin.password=password;
  const updatedAdmin= await newadmin.save();
  res.send({msg:"password updated"})

});
module.exports={router}
