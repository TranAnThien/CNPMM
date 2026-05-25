const {
    addToCartService,
    updateCartItemService,
    removeFromCartService,
    getCartService,
    clearCartService,
    validateCartService
} = require('../services/cartService');

/**
 * Add item to cart
 * POST /v1/api/cart/add
 */
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        const result = await addToCartService(userId, productId, quantity);
        return res.status(result.status).json(
            result.data ? { message: 'Item added to cart', data: result.data } : { message: result.message }
        );
    } catch (error) {
        console.log('>>> addToCart error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Get user's cart
 * GET /v1/api/cart
 */
const getCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        const result = await getCartService(userId);
        return res.status(result.status).json(result.data);
    } catch (error) {
        console.log('>>> getCart error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Update cart item quantity
 * PUT /v1/api/cart/update
 */
const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        const result = await updateCartItemService(userId, productId, quantity);
        return res.status(result.status).json(
            result.data ? { message: 'Cart updated', data: result.data } : { message: result.message }
        );
    } catch (error) {
        console.log('>>> updateCart error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Remove item from cart
 * DELETE /v1/api/cart/remove
 */
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        const result = await removeFromCartService(userId, productId);
        return res.status(result.status).json(
            result.data ? { message: 'Item removed from cart', data: result.data } : { message: result.message }
        );
    } catch (error) {
        console.log('>>> removeFromCart error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Clear entire cart
 * DELETE /v1/api/cart/clear
 */
const clearCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        const result = await clearCartService(userId);
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.log('>>> clearCart error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Validate cart before checkout
 * GET /v1/api/cart/validate
 */
const validateCart = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        const result = await validateCartService(userId);
        return res.status(result.status).json({
            isValid: result.isValid,
            message: result.message,
            data: result.data
        });
    } catch (error) {
        console.log('>>> validateCart error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCart,
    removeFromCart,
    clearCart,
    validateCart
};

