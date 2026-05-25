const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 }
    },
    { _id: false }
);

const cartSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true, index: true },
        items: [cartItemSchema],
        total: { type: Number, default: 0, min: 0 }
    },
    { timestamps: true }
);

// Auto-calculate total before saving
cartSchema.pre('save', function() {
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;

