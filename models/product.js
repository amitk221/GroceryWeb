const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Description: { type: String, required: true },
    ImageUrl: { type: String, required: false },
    MSN_SAC_Code: { type: String, required: false },
    Brand: { type: String, required: false },
    NumReviews: { type: Number, default: 0 },
    Quantity: { type: Number, required: true, default: 0 },
    Price: { type: Number, required: true, default: 0 },
    Unit: { type: String, required: false },
    CGST: { type: String, required: false },
    SGST: { type: String, required: false },
    IGST: { type: String, required: false },
    PerUnit: { type: Number, default: 1 },
    Discount: { type: Number, required: false, default: 0 },
    Rating: { type: Number, required: false }
});


const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: false },
    products: [{ type: ProductSchema }],
});

const CategoryGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: false },
    categories: [{ type: CategorySchema }],
});

const categoryProductsSchema = new mongoose.Schema({
    category_id: { type: String, required: true },
    products: [{ type: String }],
})

const Banner_s = new mongoose.Schema({
    title: { type: String, required: false },
    description: { type: String, required: false },
    redirect: { type: String, required: false },
    image: { type: String, required: false }
})
const Banner = mongoose.model("banner", Banner_s);
const Category = mongoose.model("category", CategorySchema);
const CategoryProducts = mongoose.model("categoryProducts", categoryProductsSchema);
const Product = mongoose.model('product', ProductSchema);
const CategoryGroup = mongoose.model('categorygroup', CategoryGroupSchema);
module.exports = { Product, Category, Banner, CategoryProducts, CategoryGroup };