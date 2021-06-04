const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const requireAuth = (req, res, next) => {
 

  // check json web token exists & is verified
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    jwt.verify(token, 'rahulk', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
 
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    
    jwt.verify(token, 'rahulk', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await Admin.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { requireAuth, checkUser };