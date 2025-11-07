const mongoose = require('mongoose')
const { Schema } = mongoose;


const ordersSchema = new Schema({
    user_id: { type: String },
    product_id: { type: String },
    username: { type: String },
    product: { type: String },
    orders: { type: Number },
    total_price: { type: Number }
}, {
    timestamps: true
});

module.exports = mongoose.model('orders', ordersSchema)