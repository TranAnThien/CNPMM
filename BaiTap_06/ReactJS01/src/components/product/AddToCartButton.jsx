import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/cart.context";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import { useToast } from "../common/ToastContext";

const AddToCartButton = ({ productId, productName, className = "", disabled = false, quantity: quantityProp, onQuantityChange }) => {
    const { addToCart } = useContext(CartContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [internalQuantity, setInternalQuantity] = useState(quantityProp ?? 1);
    const [loading, setLoading] = useState(false);
    const [showMessage, setShowMessage] = useState("");

    useEffect(() => {
        if (typeof quantityProp !== 'undefined') {
            setInternalQuantity(quantityProp);
        }
    }, [quantityProp]);

    const handleAddToCart = async () => {
        if (disabled) {
            return;
        }

        if (!auth.isAuthenticated) {
            navigate("/login");
            return;
        }

        const qty = quantityProp ?? internalQuantity;
        if (qty < 1) {
            showToast("Vui lòng nhập số lượng hợp lệ", { type: 'error' });
            return;
        }

        try {
            setLoading(true);
            // use the resolved qty variable (was a bug before: `quantity` was undefined)
            const result = await addToCart(productId, qty);

            if (result?.success) {
                showToast("Thêm vào giỏ hàng thành công", { type: 'success' });
                if (typeof onQuantityChange === 'function') {
                    // leave external quantity as-is
                } else {
                    setInternalQuantity(1);
                }
            } else {
                showToast(result.message || 'Không thể thêm sản phẩm', { type: 'error' });
            }
        } finally {
            setLoading(false);
        }
    };

    // Treat component as full-width when parent requests `w-full` or `flex-1` so
    // it can adapt to layouts where the button should expand (e.g. product detail)
    const isFullWidth = /\b(w-full|flex-1)\b/.test(String(className || ''));

    return (
        <div className={className}>
            {showMessage && (
                <div className="mb-3 p-3 bg-green-100 text-green-800 rounded text-sm font-semibold">
                    {showMessage}
                </div>
            )}

            {/* Layout: single row with quantity selector + add button. If parent requested full width, render full-width button. */}
            <div className={`flex items-center gap-2 ${isFullWidth ? 'w-full' : ''}`}>
                {/* Compact merged quantity selector */}
                {typeof quantityProp === 'undefined' && (
                    <div className="flex items-center h-9 rounded-md border border-gray-300 overflow-hidden">
                        <button
                            onClick={() => setInternalQuantity((q) => Math.max(1, q - 1))}
                            disabled={loading || disabled || internalQuantity <= 1}
                            className="w-9 h-9 flex items-center justify-center text-lg text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
                        >
                            −
                        </button>
                        <div className="w-12 h-9 flex items-center justify-center bg-white text-sm font-semibold text-gray-900">
                            {internalQuantity}
                        </div>
                        <button
                            onClick={() => setInternalQuantity((q) => q + 1)}
                            disabled={loading || disabled}
                            className="w-9 h-9 flex items-center justify-center text-lg text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
                        >
                            +
                        </button>
                    </div>
                )}

                {/* When parent provides quantity, we do not render a duplicate compact selector/indicator here
                    The primary quantity control should live in the Product Detail page. */}

                {/* Add to Cart: compact outlined when not full width, otherwise full-width button */}
                {isFullWidth ? (
                    <button
                        onClick={() => {
                            const qty = quantityProp ?? internalQuantity;
                            if (typeof onQuantityChange === 'function') {
                                onQuantityChange(qty);
                            }
                            handleAddToCart();
                        }}
                        disabled={loading || disabled}
                        className="flex-1 inline-flex items-center justify-center rounded-2xl bg-blue-600 h-12 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {disabled ? "Hết hàng" : loading ? "Đang thêm..." : `🛒 Thêm vào giỏ (${quantityProp ?? internalQuantity})`}
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            const qty = quantityProp ?? internalQuantity;
                            if (typeof onQuantityChange === 'function') {
                                onQuantityChange(qty);
                            }
                            handleAddToCart();
                        }}
                        disabled={loading || disabled}
                        title="Thêm vào giỏ"
                        className="h-9 w-9 flex items-center justify-center rounded-md border border-blue-600 bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="text-lg">🛒</span>
                        <span className="sr-only">Thêm</span>
                        <span className="ml-1 font-bold">+</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddToCartButton;

