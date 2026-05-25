const {
    createOrderService,
    getOrderHistoryService,
    getOrderDetailService,
    autoConfirmOrderService,
    cancelOrderService,
    getOrderStatusTimelineService
} = require('../services/orderService');

/**
 * Create order from cart
 * POST /v1/api/order/checkout
 */
const checkout = async (req, res) => {
    try {
        const { shippingAddress, notes } = req.body;
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        const result = await createOrderService(userId, shippingAddress, notes);
        return res.status(result.status).json(
            result.data ? { message: result.message, data: result.data } : { message: result.message }
        );
    } catch (error) {
        console.log('>>> checkout error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Get user's order history
 * GET /v1/api/order/history?page=1&limit=10
 */
const getOrderHistory = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const { page = 1, limit = 10 } = req.query;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        const result = await getOrderHistoryService(userId, page, limit);
        return res.status(result.status).json(result.data);
    } catch (error) {
        console.log('>>> getOrderHistory error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Get single order details
 * GET /v1/api/order/:orderId
 */
const getOrderDetail = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        const result = await getOrderDetailService(orderId, userId);
        return res.status(result.status).json(
            result.data ? result.data : { message: result.message }
        );
    } catch (error) {
        console.log('>>> getOrderDetail error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Get order status timeline
 * GET /v1/api/order/:orderId/timeline
 */
const getTimeline = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        const result = await getOrderStatusTimelineService(orderId, userId);
        return res.status(result.status).json(
            result.data ? result.data : { message: result.message }
        );
    } catch (error) {
        console.log('>>> getTimeline error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Cancel order
 * POST /v1/api/order/:orderId/cancel
 *
 * Business Logic:
 * - If < 30 mins AND (NEW or CONFIRMED): Cancel immediately, restore stock
 * - If PREPARING: Send CANCEL_REQUESTED status for admin review
 * - Otherwise: Cannot cancel
 */
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        const result = await cancelOrderService(orderId, userId);
        return res.status(result.status).json(
            result.data ? { message: result.message, data: result.data } : { message: result.message }
        );
    } catch (error) {
        console.log('>>> cancelOrder error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Manual trigger for auto-confirm (for testing/force confirmation)
 * POST /v1/api/order/:orderId/confirm
 */
const triggerAutoConfirm = async (req, res) => {
    try {
        const { orderId } = req.params;

        const result = await autoConfirmOrderService(orderId);
        return res.status(result.status).json(
            result.data ? { message: result.message, data: result.data } : { message: result.message }
        );
    } catch (error) {
        console.log('>>> triggerAutoConfirm error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    checkout,
    getOrderHistory,
    getOrderDetail,
    getTimeline,
    cancelOrder,
    triggerAutoConfirm
};

