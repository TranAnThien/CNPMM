const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        productName: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
        items: [orderItemSchema],
        total: { type: Number, required: true, min: 0 },
        shippingAddress: {
            fullName: { type: String, required: true, trim: true },
            phoneNumber: { type: String, required: true, trim: true },
            address: { type: String, required: true, trim: true },
            city: { type: String, required: true, trim: true },
            district: { type: String, required: true, trim: true },
            ward: { type: String, required: true, trim: true }
        },
        paymentMethod: { type: String, enum: ['COD'], default: 'COD' }, // Cash on Delivery
        status: {
            type: String,
            enum: ['NEW', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED', 'CANCEL_REQUESTED'],
            default: 'NEW',
            index: true
        },
        notes: { type: String, trim: true, default: '' },
        // Track auto-confirmation
        autoConfirmedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

// Index for performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('order', orderSchema);

module.exports = Order;

