const express=require('express');


const router=express.Router();


const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
    return errors;
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
    return errors;

  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
}

const maxAge = 2* 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'rahulk', {
    expiresIn: maxAge
  });
};

router.get('/login', async (req,res)=>{
    
    res.render('login',{title:"Login"});
})
router.get('/signup',(req,res)=>{
    res.render('signup',{title:"Sign Up"});
})

router.post('/login',async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await Admin.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      
      res.send({msg:"logged in"});
    } 
    catch (err) {
      const errors = handleErrors(err);
      res.send({ msg:errors.email || errors.password});
    }
  
  });


  router.post('/signup',async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    
    try {
      const user = await Admin.create({ email, password });
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id,msg:"registered succesfull" });
    }
    catch(err) {
      const errors = handleErrors(err);
      res.send({ msg:errors.email || errors.password});
    }
   
  });
  router.get('/profile', async(req, res) => {

   
    const token = req.cookies.jwt;
    
    jwt.verify(token, 'rahulk', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
    
      } else {
        let user = await Admin.findById(decodedToken.id);
     
        res.render('profile',{title:"Update Profile",admin:user});
     
      }
    });
    
    
  });
router.post("/update/:id",async (req,res)=>{
const id=req.params.id;
console.log(id);
console.log(req.body)
const {email,password}=req.body;
const user=await Admin.findById(id);

user.email=email;
user.password=password;
user.save();
res.send({msg:"passwod updated"});
console.log('user updated')

})

router.get('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    

    res.redirect('/login');

  });
module.exports=router;