import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../components/context/cart.context";
import { AuthContext } from "../components/context/auth.context";
import axios from "../util/axios.customize";
import { useModal } from "../components/common/ModalContext";
import { useToast } from "../components/common/ToastContext";

const CartPage = () => {
    const { cart, updateCartQuantity, removeFromCart, isLoadingCart } = useContext(CartContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState({});
    const [validating, setValidating] = useState(false);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate("/login");
        }
    }, [auth.isAuthenticated, navigate]);

    const handleQuantityChange = async (productId, newQuantity) => {
        setLoading(prev => ({ ...prev, [productId]: true }));
        try {
            await updateCartQuantity(productId, newQuantity);
        } finally {
            setLoading(prev => ({ ...prev, [productId]: false }));
        }
    };

    const { showConfirm } = useModal();
    const { showToast } = useToast();

    const handleRemoveItem = async (productId) => {
        const confirm = await showConfirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
        if (confirm) {
            const res = await removeFromCart(productId);
            if (res && res.success === false) {
                showToast(res.message || 'Không thể xóa sản phẩm', { type: 'error' });
            } else {
                showToast('Đã xóa sản phẩm', { type: 'success' });
            }
        }
    };

    const handleCheckout = async () => {
        if (cart.items.length === 0) {
            showToast("Giỏ hàng trống", { type: 'error' });
            return;
        }

        try {
            setValidating(true);
            const response = await axios.get("/v1/api/cart/validate");
            if (response?.isValid) {
                navigate("/checkout");
            } else {
                showToast(response?.message || "Giỏ hàng không hợp lệ", { type: 'error' });
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Kiểm tra giỏ hàng thất bại", { type: 'error' });
        } finally {
            setValidating(false);
        }
    };

    if (isLoadingCart) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="mb-4 text-5xl">🛒</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
                        <p className="text-gray-600 mb-6">Hãy thêm một số sản phẩm để tiếp tục</p>
                        <button
                            onClick={() => navigate("/shop")}
                            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Items - Left Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            {cart.items.map((item, index) => (
                                <div
                                    key={item.productId._id}
                                    className={`p-6 flex gap-4 ${index !== cart.items.length - 1 ? "border-b" : ""}`}
                                >
                                    {/* Product Image */}
                                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.productId?.images?.[0] ? (
                                            <img
                                                src={item.productId.images[0]}
                                                alt={item.productId.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                                <span className="text-gray-500">No image</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {item.productId?.name || "Unknown Product"}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Giá: <span className="text-xl font-bold text-blue-600">
                                                {item.price?.toLocaleString("vi-VN")}₫
                                            </span>
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <button
                                                onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                                                disabled={loading[item.productId._id] || item.quantity <= 1}
                                                className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    const qty = parseInt(e.target.value) || 1;
                                                    handleQuantityChange(item.productId._id, qty);
                                                }}
                                                disabled={loading[item.productId._id]}
                                                className="w-12 text-center border border-gray-300 rounded py-1 disabled:opacity-50"
                                                min="1"
                                            />
                                            <button
                                                onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                                                disabled={loading[item.productId._id]}
                                                className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                +
                                            </button>
                                            <span className="text-sm text-gray-600 ml-4">
                                                Tổng: {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                            </span>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveItem(item.productId._id)}
                                            disabled={loading[item.productId._id]}
                                            className="text-red-600 hover:text-red-700 text-sm font-semibold disabled:opacity-50 transition"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Continue Shopping */}
                        <button
                            onClick={() => navigate("/shop")}
                            className="mt-6 text-blue-600 hover:text-blue-700 font-semibold transition"
                        >
                            ← Tiếp tục mua sắm
                        </button>
                    </div>

                    {/* Order Summary - Right Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

                            <div className="space-y-4 mb-6 pb-6 border-b">
                                <div className="flex justify-between text-gray-700">
                                    <span>Số lượng sản phẩm:</span>
                                    <span className="font-semibold">
                                        {cart.items.reduce((sum, item) => sum + item.quantity, 0)} cái
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Tạm tính:</span>
                                    <span className="font-semibold">
                                        {cart.total?.toLocaleString("vi-VN")}₫
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Phí vận chuyển:</span>
                                    <span className="font-semibold text-green-600">Miễn phí</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Thuế:</span>
                                    <span className="font-semibold">0₫</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                                <span className="text-2xl font-bold text-green-600">
                                    {cart.total?.toLocaleString("vi-VN")}₫
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={validating || cart.items.length === 0}
                                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
                            >
                                {validating ? "Đang kiểm tra..." : "Tiến hành thanh toán"}
                            </button>

                            {/* Payment Info */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Phương thức thanh toán:</span>
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    ✓ Thanh toán khi nhận hàng (COD)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;

