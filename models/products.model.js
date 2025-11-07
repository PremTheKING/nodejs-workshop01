const mongoose = require('mongoose')
const { Schema } = mongoose;


const productsSchema = new Schema({
    product: { type: String },
    price: { type: Number },
    stock: { type: Number },

}, {
    timestamps: true
});

module.exports = mongoose.model('products', productsSchema)