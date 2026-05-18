const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        category: { type: String, required: true, trim: true, index: true },
        images: [{ type: String, trim: true }],
        stock: { type: Number, default: 0, min: 0 },
        sold: { type: Number, default: 0, min: 0 },
        views: { type: Number, default: 0, min: 0, index: true },
        isPromotion: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Product = mongoose.model('product', productSchema);

module.exports = Product;

