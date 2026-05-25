const Cart = require('../models/cart');
const Product = require('../models/product');

/**
 * Add item to cart or update quantity if exists
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @returns {object} Updated cart
 */
const addToCartService = async (userId, productId, quantity) => {
    try {
        // Validate inputs
        if (!userId || !productId || !quantity || quantity < 1) {
            return { status: 400, message: 'Invalid input: userId, productId, and quantity > 0 are required' };
        }

        // Check if product exists and get current price
        const product = await Product.findById(productId);
        if (!product) {
            return { status: 404, message: 'Product not found' };
        }

        if (product.stock < quantity) {
            return { status: 400, message: `Insufficient stock. Available: ${product.stock}` };
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = await Cart.create({ userId, items: [], total: 0 });
        }

        // Check if item already exists in cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock < newQuantity) {
                return { status: 400, message: `Insufficient stock. Available: ${product.stock}` };
            }
            existingItem.quantity = newQuantity;
        } else {
            // Add new item
            cart.items.push({
                productId,
                quantity,
                price: product.price
            });
        }

        // Save cart (will auto-calculate total via pre-save hook)
        await cart.save();

        // Return cart with populated product info
        await cart.populate('items.productId', 'name images category');

        return { status: 200, data: cart };
    } catch (error) {
        console.log('>>> addToCartService error:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

/**
 * Update item quantity in cart
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @param {number} quantity - New quantity
 * @returns {object} Updated cart
 */
const updateCartItemService = async (userId, productId, quantity) => {
    try {
        if (!userId || !productId || quantity === undefined) {
            return { status: 400, message: 'Invalid input: userId, productId, and quantity are required' };
        }

        // Get product to check stock
        const product = await Product.findById(productId);
        if (!product) {
            return { status: 404, message: 'Product not found' };
        }

        if (quantity > 0 && product.stock < quantity) {
            return { status: 400, message: `Insufficient stock. Available: ${product.stock}` };
        }

        // Find cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return { status: 404, message: 'Cart not found' };
        }

        // Find cart item
        const cartItem = cart.items.find(item => item.productId.toString() === productId);
        if (!cartItem) {
            return { status: 404, message: 'Item not found in cart' };
        }

        // Update quantity or remove if 0
        if (quantity <= 0) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        } else {
            cartItem.quantity = quantity;
            cartItem.price = product.price; // Update price in case product price changed
        }

        // Save cart
        await cart.save();

        // Return cart with populated product info
        await cart.populate('items.productId', 'name images category');

        return { status: 200, data: cart };
    } catch (error) {
        console.log('>>> updateCartItemService error:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

/**
 * Remove item from cart
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @returns {object} Updated cart
 */
const removeFromCartService = async (userId, productId) => {
    try {
        if (!userId || !productId) {
            return { status: 400, message: 'Invalid input: userId and productId are required' };
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return { status: 404, message: 'Cart not found' };
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        if (cart.items.length === initialLength) {
            return { status: 404, message: 'Item not found in cart' };
        }

        await cart.save();

        // Return cart with populated product info
        await cart.populate('items.productId', 'name images category');

        return { status: 200, data: cart };
    } catch (error) {
        console.log('>>> removeFromCartService error:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

/**
 * Get cart by user ID
 * @param {string} userId - User ID
 * @returns {object} Cart with populated product details
 */
const getCartService = async (userId) => {
    try {
        if (!userId) {
            return { status: 400, message: 'Invalid input: userId is required' };
        }

        const cart = await Cart.findOne({ userId }).populate('items.productId', 'name images category stock');

        if (!cart) {
            // Return empty cart if doesn't exist
            return { status: 200, data: { userId, items: [], total: 0 } };
        }

        return { status: 200, data: cart };
    } catch (error) {
        console.log('>>> getCartService error:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

/**
 * Clear cart by user ID
 * @param {string} userId - User ID
 * @returns {object} Success message
 */
const clearCartService = async (userId) => {
    try {
        if (!userId) {
            return { status: 400, message: 'Invalid input: userId is required' };
        }

        const result = await Cart.updateOne({ userId }, { items: [], total: 0 });

        if (result.matchedCount === 0) {
            // Create new empty cart if doesn't exist
            await Cart.create({ userId, items: [], total: 0 });
        }

        return { status: 200, message: 'Cart cleared successfully' };
    } catch (error) {
        console.log('>>> clearCartService error:', error);
        return { status: 500, message: 'Internal server error' };
    }
};

/**
 * Validate cart before checkout (check stock availability and prices)
 * @param {string} userId - User ID
 * @returns {object} Validation result
 */
const validateCartService = async (userId) => {
    try {
        if (!userId) {
            return { status: 400, message: 'Invalid input: userId is required', isValid: false };
        }

        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return { status: 400, message: 'Cart is empty', isValid: false };
        }

        // Check stock and prices for all items
        for (const item of cart.items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return {
                    status: 400,
                    message: `Product ${item.productId} not found`,
                    isValid: false
                };
            }

            if (product.stock < item.quantity) {
                return {
                    status: 400,
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
                    isValid: false
                };
            }

            // Price might have changed, update if needed
            if (item.price !== product.price) {
                item.price = product.price;
            }
        }

        await cart.save();
        return { status: 200, isValid: true, data: cart };
    } catch (error) {
        console.log('>>> validateCartService error:', error);
        return { status: 500, message: 'Internal server error', isValid: false };
    }
};

module.exports = {
    addToCartService,
    updateCartItemService,
    removeFromCartService,
    getCartService,
    clearCartService,
    validateCartService
};

