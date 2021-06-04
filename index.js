const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const PORT = process.env.PORT || 3000;
const ejs = require("ejs");
const xls=require("read-excel-file/node");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const datarouter = require('./routes/productRoute');
const config = require("./config/config");
const mongoose = require('mongoose');
const authRouter = require('./routes/authRoute');
const mailRouter = require("./routes/mailRoute").router;
const Admin = require("./models/Admin");
const requireAuth = require('./middleware/authmiddleware').requireAuth;
dotenv.config();
const Category = require('./models/product').Category;
const Product = require('./models/product').Product;
const Banner = require('./models/product').Banner;
const Order = require('./models/Order').Order;
// <<<<<<< HEAD
const { Adress } = require('./models/Order');
const User = require('./models/User');
const mongoUrl=config.MONGODB_URL;
// =======
const Address = require('./models/Order').Address;

// >>>>>>> 9b572400d46e5c10d91716357092f91b5dc1f34c
// const mongoUrl="";
mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false

    }).then((res) => { app.listen(PORT, () => { console.log("connected to the", PORT) }); })
    .catch(error => console.log(error));


app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static('public'))
app.use(express.json());
app.set('view engine', 'ejs');

app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

app.use(authRouter);
app.use(mailRouter);



// xls
app.get("/xls",(req,res)=>{
 xls("./data.xlsx")
  .then((rows)=>{
    console.log(rows)
    res.json(rows);
  });
  
})

// %%%%%%%%%%%%%%% category
app.get("/api/categories", async(req, res) => {
    const categories = await Category.find();

    res.json(categories)
});

app.get("/api/categories/:id", async(req, res) => {
    const id = req.params.id;
    const productscat = await Product.find({ category_id: id });
    res.json(productscat);
});


app.get("/api/products", async(req, res) => {
    const products = await Product.find();
    res.json(products)
});

app.get("/api/search/products", async(req, res) => {
    const search = req.query.search;
    const regex = new RegExp(search, 'i');
    const searchproducts = await Product.find({ name: { $regex: regex } });
    res.json(searchproducts)
});

/**
 * format api/productsByIds?ids=607066b9e120860022e605a9,6078272aea0a6c3c8ccbf20d
 *  - comma separated ids
 */
app.get("/api/productsByIds", async(req, res) => {
    if (!req.query.ids)
        res.json([]);
    else {
        var ids = [...new Set(req.query.ids.split(','))];
        const products = await Product.find({ _id: { $in: ids } });

        res.json(products);
    }
});

app.get("/api/product/:id", async(req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    res.json(product);
});
app.get("/api/banner", async(req, res) => {

    const banner = await Banner.find();
    res.json(banner);

});

app.get("/api/banner", async(req, res) => {
    const token = req.cookies.jwt;

    const All = await Banner.find();
    res.json(All);

});

// ####################### authenticate ###########
// / handle errors
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

app.post('/api/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Admin.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        res.send({ msg: "logged in" });
    } catch (err) {
        const errors = handleErrors(err);
        res.send({ msg: errors.email || errors.password });
    }

});
const maxAge = 2 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'rahulk', {
        expiresIn: maxAge
    });
};
app.post('/api/signup', async(req, res) => {
    const { email, password, mobile, address, fullname, pincode } = req.body;
    console.log(req.body);

    try {
        const user = await Admin.create({ email, password, mobile, address, fullname, pincode });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id, msg: "registered succesfull" });
    } catch (err) {
        const errors = handleErrors(err);
        res.send({ msg: errors.email || errors.password });
    }

});

/*

Create a new Address
    body
      {
        "full_name" : "",
        "line_1" : "",
        "line_2" : "",
        "phone_no" : ,
        "city": "",
        "state": "",
        "pincode": 785089,
        "userId": ""
    }



*/
app.post('/api/address', async(req, res) => {
    const { full_name, line_1, line_2, city, state, pincode, phone_no, userId } = req.body;
    const newAddress = await Address.create({ full_name: full_name, line_1: line_1, line_2: line_2, city: city, state: state, pincode: pincode, phone_no: phone_no, userId: userId });

    if (newAddress) {
        res.json(newAddress._id);
    }

    res.json("unable to add the Address");
});
/*
Get all addresses of a user 
url : /api/addresses?user_id=
*/
app.get('/api/addresses', async(req, res) => {
    if (!req.query.user_id) {
        res.json([]);
    } else {
        const address = await Address.find({ userId: req.query.user_id });
        res.json(address);
    }

});


app.delete('/api/address/:id', async(req, res) => {

    const address = await Address.findByIdAndDelete(req.params.id);
    if (address)
        res.json("Deleted Address");
    else res.json("Failed to Delete");

});


/**
 * Sample Post Request
 * {
  "userId": , 
  "products":[{"productId": "60706654e120860022e605a8","productCount":10},
	{"productId": "607066b9e120860022e605a9","productCount":7}] , 
  "address":{
    "full_name" : "Yashobanta Kumar Behera",
    "line_1" : "IGIT",
    "line_2" : "IGIT",
    "phone_no" : 8114969195,
    "city": "Bhiwadi",
    "state": "Haryana",
    "pincode": 785089,
    "userId": "yash027@gmail.com"
  }, 
  "orderId": "jrubnvvh", 
  "paymentId": "jhjryui",
}
 */

app.post('/api/order', async(req, res) => {
    const { userId, amount, discount, products, address, orderId, paymentId, status, date_time } = req.body;

    order_products = []
    for (var i = 0; i < products.length; i++) {
        const product = await Product.findById(products[i].productId);
        await Product.findOneAndUpdate({ _id: product._id }, { $set: { quantity: (product.quantity - products[i].productCount) } }, { upsert: false }, null);
        product.quantity = products[i].productCount;
        order_products.push(product);
    }

    const newOrder = await Order.create({ userId: userId, orderId: orderId, paymentId: paymentId, products: order_products, address: address, amount: amount, discount: discount, status: status, date_time: date_time });

    if (newOrder) {
        res.json(newOrder._id);
    } else {
        res.json(null);
    }
});


/*
Get all Orders of a user 
url : /api/orders?user_id=
*/
app.get('/api/orders', async(req, res) => {
    if (!req.query.user_id) {
        res.json([]);
    } else {
        const orders = await Order.find({ userId: req.query.user_id });
        res.json(orders);
    }
});


app.get('/api/order/:id', async(req, res) => {
    if (!req.params.id) {
        res.json([]);
    } else {
        const orders = await Order.findById(req.params.id);
        res.json(orders);
    }
});


app.put('/api/order', async(req, res) => {

    const { _id, userId, products, address, orderId, paymentId, amount, discount, status } = req.body;

    if (status == 'Failed') {
        for (var i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].productId);
            await Product.findOneAndUpdate({ _id: product._id }, { $set: { quantity: (product.quantity + products[i].productCount) } }, { upsert: false }, null);
        }
    }

    Order.findOneAndUpdate({ _id: _id, userId: userId }, { $set: { orderId: orderId, paymentId: paymentId, status: status } }, { upsert: false }, function(err, doc) {
        if (err) {
            res.json("failed");
        } else {
            res.json("Success");
        }
    });

});



app.get('/api/order/delete/:userid', async(req, res) => {

    const order = await Order.deleteMany({ userId: req.params.userid }, null, null);
    if (order)
        res.json("all orders deleted");
    else res.json("Failed to Delete");

});


  app.get('/api/users',async(req,res)=>{
    const users=await User.find();
    res.json(users);
    });
  
  

app.delete('/api/order/:id', async(req, res) => {

    const order = await Order.findByIdAndDelete(req.params.id);
    if (order)
        res.json("Deleted order");
    else res.json("Failed to Delete");

});



app.get('/api/activity/home', async(req, res) => {



    const categories = await Category.find();

    var home = `[
    {
      "type": "heading",
      "text": "Exclusive Offer",
      "color": "#674930"
    },
    {
      "type": "carousel",
      "items": [
        {
          "id": 1,
          "title" : "",
          "category_id" : "",
          "art": "https://www.bigbasket.com/media/uploads/section_item/images/hdpi/HP_atta-banner_1440x692-1stjan21.jpg"
        },
        {
          "id": 2,
          "title" : "",
          "category_id" : "",
          "art": "https://www.bigbasket.com/media/uploads/section_item/images/hdpi/HP_NTP3871_Disinfectant-and-Freshener_1440x692_01Feb21.jpg"
        },
        {
          "id": 3,
          "title" : "",
          "category_id" : "",
          "art": "https://www.bigbasket.com/media/uploads/section_item/images/hdpi/2102026_delicious-snack_692.jpg"
        },
        {
          "id": 4,
          "title" : "",
          "category_id" : "",
          "art": "https://www.bigbasket.com/media/uploads/section_item/images/hdpi/210203_Fresho_meat_Bangalore-1440X692-3rdfeb21.jpg"
        },
        {
          "id": 5,
          "title" : "",
          "category_id" : "",
          "art": "https://www.bigbasket.com/media/uploads/section_item/images/hdpi/2102239_bbpl-staples_692_Bangalore.jpg"
        },
        {
          "id": 6,
          "title" : "",
          "category_id" : "",
          "art": "https://4.bp.blogspot.com/-uhjF2kC3tFc/U_r3myvwzHI/AAAAAAAACiw/tPQ2XOXFYKY/s1600/Circles-3.gif"
        }
      ]
    },
    {
      "type": "slider",
      "title": "Daily Needs",
      "items": [
        {
          "id": 1,
          "title": "Grocery and Staples",
          "art": "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,w=360,h=391/layout-engine/2020-10/shop_img01_7.png"
        },
        {
          "id": 2,
          "title": "Kitchen & Dinning",
          "art": "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,w=360,h=391/layout-engine/2021-01/Kitchen-Dining.png"
        },
        {
          "id": 3,
          "title": "Household Items",
          "art": "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,w=360,h=391/layout-engine/2020-10/shop_img03.png"
        },
        {
          "id": 4,
          "title": "Fruits & Vegetables",
          "art": "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,w=360,h=391/layout-engine/2020-10/shop_img05.png"
        },
        {
          "id": 5,
          "title": "Breakfast & Dairy",
          "art": "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,w=360,h=391/layout-engine/2020-10/shop_img07.png"
        },
        {
          "id": 6,
          "title": "Lowest Price Brands",
          "art": "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,w=360,h=391/layout-engine/2020-12/shop_img10-1_3.png"
        },
        {
          "id": 7,
          "title": "Best Value Brands",
          "art": "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,w=360,h=391/layout-engine/2020-12/shop_img11-1.png"
        }
      ]
    },
    {
      "type": "banner",
      "art": "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,h=225/layout-engine/2021-02/1-flash-sale.jpg",
      "title" : "50% off",
      "categoryId": "7786256755"
    },
    {
      "type": "heading",
      "text": "Shop by Category",
      "color": "#674930"
    },
    {
      "type": "category",
      "items": ${JSON.stringify(categories)}
    }
  ]`;

    res.write(home);
    res.end();

});





















app.get('*', requireAuth);
app.use(datarouter);
app.get('/', (req, res) => {
    const token = req.cookies.jwt;
    jwt.verify(token, 'rahulk', async(err, decodedToken) => {
        let admin = await Admin.findById(decodedToken.id);

        res.render('index', { admin: admin, title: "Dashboard" })
    });
});




app.get('/forget', (req, res) => {
    res.render('forget', { admin: admin, title: "forget password" })
});