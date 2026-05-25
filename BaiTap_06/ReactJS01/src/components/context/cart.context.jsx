import { createContext, useState, useCallback, useContext, useEffect } from 'react';
import { AuthContext } from './auth.context';
import axios from '../../util/axios.customize';

export const CartContext = createContext({
    cart: { items: [], total: 0 },
    setCart: () => {},
    isLoadingCart: false,
    addToCart: async () => {},
    removeFromCart: async () => {},
    updateCartQuantity: async () => {},
    clearCart: async () => {},
});

export const CartWrapper = (props) => {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [isLoadingCart, setIsLoadingCart] = useState(false);
    const { auth } = useContext(AuthContext);

    // Fetch cart on mount
    const fetchCart = useCallback(async () => {
        try {
            setIsLoadingCart(true);
            const response = await axios.get('/v1/api/cart');
            setCart(response || { items: [], total: 0 });
        } catch (error) {
            console.error('Failed to load cart:', error);
            setCart({ items: [], total: 0 });
        } finally {
            setIsLoadingCart(false);
        }
    }, []);

    useEffect(() => {
        if (auth?.isAuthenticated) {
            fetchCart();
        } else {
            setCart({ items: [], total: 0 });
        }
    }, [auth?.isAuthenticated, fetchCart]);

    // Add to cart
    const addToCart = useCallback(async (productId, quantity) => {
        try {
            const response = await axios.post('/v1/api/cart/add', {
                productId,
                quantity: parseInt(quantity)
            });
            if (response?.data) {
                setCart(response.data);
                return { success: true, message: 'Item added to cart' };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add item to cart';
            return { success: false, message };
        }
    }, []);

    // Remove from cart
    const removeFromCart = useCallback(async (productId) => {
        try {
            const response = await axios.delete('/v1/api/cart/remove', {
                data: { productId }
            });
            if (response?.data) {
                setCart(response.data);
                return { success: true, message: 'Item removed from cart' };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to remove item';
            return { success: false, message };
        }
    }, []);

    // Update cart item quantity
    const updateCartQuantity = useCallback(async (productId, quantity) => {
        try {
            if (quantity <= 0) {
                return await removeFromCart(productId);
            }
            const response = await axios.put('/v1/api/cart/update', {
                productId,
                quantity: parseInt(quantity)
            });
            if (response?.data) {
                setCart(response.data);
                return { success: true, message: 'Cart updated' };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update cart';
            return { success: false, message };
        }
    }, [removeFromCart]);

    // Clear cart
    const clearCart = useCallback(async () => {
        try {
            await axios.delete('/v1/api/cart/clear');
            setCart({ items: [], total: 0 });
            return { success: true, message: 'Cart cleared' };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to clear cart';
            return { success: false, message };
        }
    }, []);

    return (
        <CartContext.Provider value={{
            cart,
            setCart,
            isLoadingCart,
            fetchCart,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            clearCart
        }}>
            {props.children}
        </CartContext.Provider>
    );
};

