import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../components/context/cart.context";
import { AuthContext } from "../components/context/auth.context";
import axios from "../util/axios.customize";
import { useToast } from "../components/common/ToastContext";

const CheckoutPage = () => {
    const { cart, clearCart } = useContext(CartContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        address: "",
        city: "",
        district: "",
        ward: "",
        notes: ""
    });

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate("/login");
        }
        if (cart.items.length === 0) {
            navigate("/cart");
        }
    }, [auth.isAuthenticated, cart.items.length, navigate]);

    const validateForm = () => {
        const newErrors = {};
        const required = ["fullName", "phoneNumber", "address", "city", "district", "ward"];

        required.forEach(field => {
            if (!formData[field]?.trim()) {
                newErrors[field] = `Vui lòng nhập ${field}`;
            }
        });

        // Validate phone number (10-11 digits)
        const phoneRegex = /^(\d{10,11})$/;
        if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber.replace(/\D/g, ""))) {
            newErrors.phoneNumber = "Số điện thoại không hợp lệ (10-11 chữ số)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post("/v1/api/order/checkout", {
                shippingAddress: {
                    fullName: formData.fullName.trim(),
                    phoneNumber: formData.phoneNumber.trim(),
                    address: formData.address.trim(),
                    city: formData.city.trim(),
                    district: formData.district.trim(),
                    ward: formData.ward.trim()
                },
                notes: formData.notes.trim()
            });

            if (response?.data?._id) {
                // Clear cart context
                await clearCart();

                // Navigate to order detail
                navigate(`/order/${response.data._id}`, { state: { newOrder: true } });
            }
        } catch (error) {
            const message = error.response?.data?.message || "Thanh toán thất bại";
            showToast(message, { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (cart.items.length === 0) {
        return null;
    }

    const inputClasses = "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const errorClasses = "text-red-600 text-sm mt-1";

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Checkout Form - Left Column */}
                    <form onSubmit={handleSubmit} className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-8">
                            {/* Shipping Address Section */}
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Địa chỉ giao hàng</h2>

                                <div className="space-y-4">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Họ và tên *
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Nhập họ và tên"
                                            className={inputClasses}
                                        />
                                        {errors.fullName && <p className={errorClasses}>{errors.fullName}</p>}
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Số điện thoại *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="Nhập số điện thoại (10-11 chữ số)"
                                            className={inputClasses}
                                        />
                                        {errors.phoneNumber && <p className={errorClasses}>{errors.phoneNumber}</p>}
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Địa chỉ *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Nhập địa chỉ (đường, số nhà)"
                                            className={inputClasses}
                                        />
                                        {errors.address && <p className={errorClasses}>{errors.address}</p>}
                                    </div>

                                    {/* City, District, Ward */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Thành phố *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder="Hà Nội"
                                                className={inputClasses}
                                            />
                                            {errors.city && <p className={errorClasses}>{errors.city}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Quận/Huyện *
                                            </label>
                                            <input
                                                type="text"
                                                name="district"
                                                value={formData.district}
                                                onChange={handleChange}
                                                placeholder="Ba Đình"
                                                className={inputClasses}
                                            />
                                            {errors.district && <p className={errorClasses}>{errors.district}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Phường/Xã *
                                            </label>
                                            <input
                                                type="text"
                                                name="ward"
                                                value={formData.ward}
                                                onChange={handleChange}
                                                placeholder="Phúc Tân"
                                                className={inputClasses}
                                            />
                                            {errors.ward && <p className={errorClasses}>{errors.ward}</p>}
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Ghi chú (tùy chọn)
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            placeholder="Ví dụ: Giao hàng vào buổi sáng, chuông cửa lớn..."
                                            rows="3"
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Section */}
                            <div className="border-t pt-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Phương thức thanh toán</h2>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="cod"
                                            name="payment"
                                            value="cod"
                                            defaultChecked
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <label htmlFor="cod" className="ml-3 cursor-pointer">
                                            <span className="font-semibold text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Bạn sẽ thanh toán khi nhân viên giao hàng đến
                                            </p>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-8 pt-8 border-t flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/cart")}
                                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-semibold transition"
                                >
                                    Quay lại giỏ hàng
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
                                >
                                    {loading ? "Đang xử lý..." : "Đặt hàng"}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Order Summary - Right Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

                            {/* Items List */}
                            <div className="space-y-3 mb-6 pb-6 border-b max-h-80 overflow-y-auto">
                                {cart.items.map(item => (
                                    <div key={item.productId._id} className="flex justify-between text-sm">
                                        <span className="text-gray-700">
                                            {item.productId?.name} x {item.quantity}
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                            {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 pb-6 border-b">
                                <div className="flex justify-between text-gray-700">
                                    <span>Tạm tính:</span>
                                    <span>{cart.total?.toLocaleString("vi-VN")}₫</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Phí vận chuyển:</span>
                                    <span className="text-green-600 font-semibold">Miễn phí</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Thuế:</span>
                                    <span>0₫</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-900">Tổng cộng:</span>
                                <span className="text-2xl font-bold text-green-600">
                                    {cart.total?.toLocaleString("vi-VN")}₫
                                </span>
                            </div>

                            {/* Info Box */}
                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-xs text-yellow-800">
                                    <span className="font-semibold">ℹ️ Lưu ý:</span> Đơn hàng của bạn sẽ được tự động xác nhận sau 30 phút nếu không có thay đổi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;

