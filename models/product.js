const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    product_image_2: { type: String, required: false },
    product_image_1: { type: String, required: false },
    brand: { type: String, required: false },
    description: { type: String, required: true },
    numReviews: { type: Number, default: 0 },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    unit: { type: String, required: false },
    perUnit: { type: Number, default: 1 },
    discount: { type: Number, required: false, default: 0 },
    rating: { type: Number, required: false }


});
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false }
})

const Banner_s = new mongoose.Schema({
    title: { type: String, required: false },
    description: { type: String, required: false },
    redirect: { type: String, required: false },
    image: { type: String, required: false }
})
const Banner = mongoose.model("banner", Banner_s);
const Category = mongoose.model("category", CategorySchema);
const Product = mongoose.model('product', ProductSchema);
module.exports = { Product, Category, Banner };