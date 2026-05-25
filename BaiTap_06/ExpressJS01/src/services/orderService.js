const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

const getOrderAgeMinutes = (createdAt) => {
    return Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60));
};

const autoConfirmOrderByIdService = async (orderId, userId = null) => {
    const threshold = new Date(Date.now() - THIRTY_MINUTES_MS);
    const query = { _id: orderId, status: 'NEW', createdAt: { $lte: threshold } };
    if (userId) {
        query.userId = userId;
    }

    await Order.updateOne(
        query,
        { $set: { status: 'CONFIRMED', autoConfirmedAt: new Date() } }
    );
};

/**
 * Create order from cart
 * Validates cart, creates order, decreases stock, clears cart
 */
const createOrderService = async (userId, shippingAddress, notes = '') => {
    try {
        // Validate inputs
        if (!userId || !shippingAddress) {
            return { status: 400, message: 'Missing userId or shippingAddress' };
        }

        const requiredFields = ['fullName', 'phoneNumber', 'address', 'city', 'district', 'ward'];
        for (const field of requiredFields) {
            if (!shippingAddress[field] || !shippingAddress[field].trim()) {
                return { status: 400, message: `Shipping address field "${field}" is required` };
            }
        }

        // Validate phone number (basic validation)
        if (!/^\d{10,11}$/.test(shippingAddress.phoneNumber.replace(/[^\d]/g, ''))) {
            return { status: 400, message: 'Invalid phone number (10-11 digits required)' };
        }

        // Get cart
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return { status: 400, message: 'Cart is empty' };
        }

        // Validate stock for all items and prepare order items
        const orderItems = [];
        for (const cartItem of cart.items) {
            const product = cartItem.productId;

            if (!product) {
                return { status: 404, message: 'Product not found in cart' };
            }

            if (product.stock < cartItem.quantity) {
                return {
                    status: 400,
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}`
                };
            }

            orderItems.push({
                productId: product._id,
                productName: product.name,
                price: cartItem.price,
                quantity: cartItem.quantity
            });
        }

        // Create order
        const order = await Order.create({
            userId,
            items: orderItems,
            total: cart.total,
            shippingAddress: {
                fullName: shippingAddress.fullName.trim(),
                phoneNumber: shippingAddress.phoneNumber.trim(),
                address: shippingAddress.address.trim(),
                city: shippingAddress.city.trim(),
                district: shippingAddress.district.trim(),
                ward: shippingAddress.ward.trim()
            },
            paymentMethod: 'COD',
            status: 'NEW',
            notes: notes ? notes.trim() : ''
        });

        // Decrease product stock and increase sold count
        for (const orderItem of orderItems) {
            await Product.findByIdAndUpdate(
                orderItem.productId,
                {
                    $inc: { stock: -orderItem.quantity, sold: orderItem.quantity }
                },
                { new: true }
            );
        }

        // Clear cart
        await Cart.updateOne({ userId }, { items: [], total: 0 });

        return {
            status: 201,
            message: 'Order created successfully',
            data: order
        };
    } catch (error) {
        console.log('>>> createOrderService error:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

/**
 * Get user's order history with pagination
 */
const getOrderHistoryService = async (userId, page = 1, limit = 10) => {
    try {
        if (!userId) {
            return { status: 400, message: 'userId is required' };
        }

        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
        const skip = (pageNum - 1) * limitNum;

        // Auto-confirm any eligible NEW orders before returning history
        await Order.updateMany(
            {
                userId,
                status: 'NEW',
                createdAt: { $lte: new Date(Date.now() - THIRTY_MINUTES_MS) }
            },
            { $set: { status: 'CONFIRMED', autoConfirmedAt: new Date() } }
        );

        // Execute queries in parallel
        const [orders, total] = await Promise.all([
            Order.find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .populate('items.productId', 'images')
                .lean(),
            Order.countDocuments({ userId })
        ]);

        return {
            status: 200,
            data: {
                orders,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum)
                }
            }
        };
    } catch (error) {
        console.log('>>> getOrderHistoryService error:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

/**
 * Get single order by ID
 */
const getOrderDetailService = async (orderId, userId) => {
    try {
        if (!orderId || !userId) {
            return { status: 400, message: 'orderId and userId are required' };
        }

        // Auto-confirm if this order passed the 30-minute threshold
        await autoConfirmOrderByIdService(orderId, userId);

        const order = await Order.findById(orderId)
            .populate('items.productId', 'name images category price')
            .lean();

        if (!order) {
            return { status: 404, message: 'Order not found' };
        }

        // Verify ownership
        if (order.userId.toString() !== userId.toString()) {
            return { status: 403, message: 'Unauthorized: This order does not belong to you' };
        }

        // Calculate time elapsed since creation
        const createdAt = new Date(order.createdAt);
        const now = new Date();
        const minutesElapsed = Math.floor((now - createdAt) / (1000 * 60));
        const autoConfirmInMinutes = Math.max(0, 30 - minutesElapsed);

        return {
            status: 200,
            data: {
                ...order,
                minutesElapsed,
                autoConfirmInMinutes,
                canCancel: order.status === 'NEW' || order.status === 'CONFIRMED' || order.status === 'PREPARING'
            }
        };
    } catch (error) {
        console.log('>>> getOrderDetailService error:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

/**
 * Calculate time elapsed since order creation
 * Auto-confirm order if 30 minutes have passed
 */
const autoConfirmOrderService = async (orderId) => {
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return { status: 404, message: 'Order not found' };
        }

        if (order.status !== 'NEW') {
            return { status: 400, message: 'Order cannot be auto-confirmed in its current status' };
        }

        const minutesElapsed = getOrderAgeMinutes(order.createdAt);

        if (minutesElapsed >= 30) {
            order.status = 'CONFIRMED';
            order.autoConfirmedAt = new Date();
            await order.save();
            return { status: 200, message: 'Order auto-confirmed', data: order };
        }

        const minutesRemaining = Math.ceil(30 - minutesElapsed);
        return {
            status: 400,
            message: `Order will be auto-confirmed in ${minutesRemaining} minutes`,
            minutesRemaining
        };
    } catch (error) {
        console.log('>>> autoConfirmOrderService error:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

/**
 * Cancel order with business logic
 * Rules:
 * - If < 30 mins AND (NEW or CONFIRMED): Cancel immediately
 * - If PREPARING: Change to CANCEL_REQUESTED
 * - Otherwise: Cannot cancel
 */
const cancelOrderService = async (orderId, userId) => {
    try {
        if (!orderId || !userId) {
            return { status: 400, message: 'orderId and userId are required' };
        }

        // Sync auto-confirmation before evaluating cancellation rules
        await autoConfirmOrderByIdService(orderId, userId);

        const order = await Order.findById(orderId);
        if (!order) {
            return { status: 404, message: 'Order not found' };
        }

        // Verify ownership
        if (order.userId.toString() !== userId.toString()) {
            return { status: 403, message: 'Unauthorized: This order does not belong to you' };
        }

        const minutesElapsed = getOrderAgeMinutes(order.createdAt);

        // Business Logic for Cancellation
        if (minutesElapsed < 30 && (order.status === 'NEW' || order.status === 'CONFIRMED')) {
            // Case 1: Within 30 mins and status is NEW or CONFIRMED -> Cancel immediately
            order.status = 'CANCELLED';
            await order.save();

            // Restore product stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(
                    item.productId,
                    {
                        $inc: { stock: item.quantity, sold: -item.quantity }
                    },
                    { new: true }
                );
            }

            return {
                status: 200,
                message: 'Order cancelled successfully. Stock has been restored.',
                data: order
            };
        } else if (order.status === 'PREPARING') {
            // Case 2: PREPARING status -> Request cancellation
            order.status = 'CANCEL_REQUESTED';
            await order.save();

            return {
                status: 200,
                message: 'Cancellation request sent. Admin will review your request.',
                data: order
            };
        } else if (order.status === 'CANCELLED') {
            return {
                status: 400,
                message: 'Order is already cancelled'
            };
        } else if (order.status === 'CANCEL_REQUESTED') {
            return {
                status: 400,
                message: 'Cancellation request is already pending. Please wait for admin approval.'
            };
        } else if (order.status === 'DELIVERING' || order.status === 'DELIVERED') {
            return {
                status: 400,
                message: `Cannot cancel order in ${order.status} status. Please contact support for returns.`
            };
        } else {
            return {
                status: 400,
                message: `Cannot cancel order. Time elapsed: ${Math.floor(minutesElapsed)} minutes. Status: ${order.status}`
            };
        }
    } catch (error) {
        console.log('>>> cancelOrderService error:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

/**
 * Get order status timeline
 */
const getOrderStatusTimelineService = async (orderId, userId) => {
    try {
        if (!orderId || !userId) {
            return { status: 400, message: 'orderId and userId are required' };
        }

        // Auto-confirm if the order has crossed the 30-minute threshold
        await autoConfirmOrderByIdService(orderId, userId);

        const order = await Order.findById(orderId).lean();
        if (!order) {
            return { status: 404, message: 'Order not found' };
        }

        if (order.userId.toString() !== userId.toString()) {
            return { status: 403, message: 'Unauthorized' };
        }

        // Define status timeline steps
        const statusSteps = [
            { status: 'NEW', label: 'Đơn hàng mới', description: 'Đơn hàng vừa được tạo' },
            { status: 'CONFIRMED', label: 'Đã xác nhận', description: 'Đơn hàng đã được xác nhận (tự động sau 30 phút)' },
            { status: 'PREPARING', label: 'Chuẩn bị hàng', description: 'Shop đang chuẩn bị sản phẩm' },
            { status: 'DELIVERING', label: 'Đang giao hàng', description: 'Đơn hàng đang trên đường tới bạn' },
            { status: 'DELIVERED', label: 'Đã giao thành công', description: 'Đơn hàng đã được giao thành công' }
        ];

        // Find current step index
        const currentStepIndex = statusSteps.findIndex(s => s.status === order.status);
        const completedSteps = statusSteps.slice(0, currentStepIndex + 1);
        const remainingSteps = statusSteps.slice(currentStepIndex + 1);

        // Handle cancelled orders
        if (order.status === 'CANCELLED') {
            completedSteps.push({
                status: 'CANCELLED',
                label: 'Hủy đơn hàng',
                description: 'Đơn hàng đã bị hủy'
            });
        }

        if (order.status === 'CANCEL_REQUESTED') {
            completedSteps.push({
                status: 'CANCEL_REQUESTED',
                label: 'Yêu cầu hủy',
                description: 'Đã gửi yêu cầu hủy đơn hàng'
            });
        }

        return {
            status: 200,
            data: {
                currentStatus: order.status,
                completedSteps,
                remainingSteps,
                timeline: completedSteps,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            }
        };
    } catch (error) {
        console.log('>>> getOrderStatusTimelineService error:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

module.exports = {
    createOrderService,
    getOrderHistoryService,
    getOrderDetailService,
    autoConfirmOrderService,
    cancelOrderService,
    getOrderStatusTimelineService
};

