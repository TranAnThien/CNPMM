import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "../util/axios.customize";
import { useModal } from "../components/common/ModalContext";
import { useToast } from "../components/common/ToastContext";

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [timeline, setTimeline] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [autoConfirmCountdown, setAutoConfirmCountdown] = useState(null);
    const countdownIntervalRef = useRef(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    // Start countdown timer
    useEffect(() => {
        if (order?.status === 'NEW' && order?.autoConfirmInMinutes !== undefined) {
            const startCountdown = () => {
                const minutesLeft = Math.max(0, order.autoConfirmInMinutes);
                setAutoConfirmCountdown(minutesLeft);

                countdownIntervalRef.current = setInterval(() => {
                    setAutoConfirmCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(countdownIntervalRef.current);
                            // Refresh order to get updated status
                            fetchOrderDetails();
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 60000); // Update every minute
            };

            startCountdown();
        }

        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        };
    }, [order?.status, order?.autoConfirmInMinutes]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);

            const [orderRes, timelineRes] = await Promise.all([
                axios.get(`/v1/api/order/${orderId}`),
                axios.get(`/v1/api/order/${orderId}/timeline`)
            ]);

            setOrder(orderRes);
            setTimeline(timelineRes);
        } catch (error) {
            console.error("Failed to load order:", error);
            showToast(error.response?.data?.message || "Tải đơn hàng thất bại", { type: 'error' });
            navigate("/order/history");
        } finally {
            setLoading(false);
        }
    };

    const { showConfirm } = useModal();
    const { showToast } = useToast();

    const handleCancel = async () => {
        const confirmMessage = order?.status === 'PREPARING'
            ? "Yêu cầu hủy sẽ được gửi tới quản trị viên. Bạn có chắc chắn?"
            : "Bạn có chắc chắn muốn hủy đơn hàng này?";

        const confirmed = await showConfirm(confirmMessage);
        if (!confirmed) return;

        try {
            setCancelling(true);
            const response = await axios.post(`/v1/api/order/${orderId}/cancel`);

            if (response?.data) {
                // Always show Vietnamese success message for cancel
                showToast('Hủy đơn thành công', { type: 'success' });
                await fetchOrderDetails();
            }
        } catch (error) {
            showToast(error.response?.data?.message || "Hủy đơn hàng thất bại", { type: 'error' });
        } finally {
            setCancelling(false);
        }
    };

    if (loading && !order) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-gray-600">Đơn hàng không được tìm thấy</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Đơn hàng #{orderId.slice(-8).toUpperCase()}
                        </h1>
                        <p className="text-gray-600">
                            Ngày đặt hàng: {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>

                    {/* Cancel Button */}
                    {order.canCancel && (
                        <button
                            onClick={handleCancel}
                            disabled={cancelling || loading}
                            className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
                                order.status === 'PREPARING'
                                    ? 'bg-orange-600 hover:bg-orange-700'
                                    : 'bg-red-600 hover:bg-red-700'
                            } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                        >
                            {cancelling ? 'Đang xử lý...' :
                             order.status === 'PREPARING' ? 'Yêu cầu hủy đơn' : 'Hủy đơn hàng'}
                        </button>
                    )}
                </div>

                {/* Success banner when coming from checkout */}
                {location?.state?.newOrder && (
                    <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between">
                        <div className="text-emerald-800 font-semibold">Đặt hàng thành công</div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/shop')} className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm">Tiếp tục mua sắm</button>
                            <button onClick={() => navigate(`/order/${orderId}`)} className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">Xem đơn</button>
                        </div>
                    </div>
                )}

                {/* Timeline Section */}
                {timeline && (
                    <div className="bg-white rounded-lg shadow p-8 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-8">Trạng thái đơn hàng</h2>

                        {/* Auto-confirm Countdown */}
                        {order.status === 'NEW' && autoConfirmCountdown !== null && autoConfirmCountdown > 0 && (
                            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800">
                                    <span className="font-semibold">⏱️ Đơn hàng sẽ tự động xác nhận trong</span>
                                    <span className="ml-2 text-lg font-bold text-yellow-900">{autoConfirmCountdown} phút</span>
                                </p>
                            </div>
                        )}

                        {/* Timeline Steps */}
                        <div className="space-y-6">
                            {timeline.timeline && timeline.timeline.map((step, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    {/* Timeline Circle */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                                            ✓
                                        </div>
                                        {index < timeline.timeline.length - 1 && (
                                            <div className="w-1 h-16 bg-green-300 my-2"></div>
                                        )}
                                    </div>

                                    {/* Timeline Content */}
                                    <div className="pt-2">
                                        <p className="font-bold text-gray-900">{step.label}</p>
                                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Remaining Steps */}
                            {timeline.remainingSteps && timeline.remainingSteps.length > 0 && (
                                <>
                                    {/* Last completed step to next step connector */}
                                    {timeline.timeline.length > 0 && (
                                        <div className="flex items-start gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-1 h-16 bg-gray-300"></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Remaining steps (not yet active) */}
                                    {timeline.remainingSteps.map((step, index) => (
                                        <div key={`remaining-${index}`} className="flex items-start gap-4 opacity-50">
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold flex-shrink-0">
                                                    {index + 1}
                                                </div>
                                                {index < timeline.remainingSteps.length - 1 && (
                                                    <div className="w-1 h-16 bg-gray-300 my-2"></div>
                                                )}
                                            </div>

                                            <div className="pt-2">
                                                <p className="font-bold text-gray-700">{step.label}</p>
                                                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items - Left Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b bg-gray-50">
                                <h2 className="text-lg font-bold text-gray-900">Sản phẩm</h2>
                            </div>

                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className={`px-6 py-4 flex gap-4 ${index !== order.items.length - 1 ? 'border-b' : ''}`}
                                >
                                    {/* Product Image */}
                                    <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                                        {item.productId?.images?.[0] ? (
                                            <img
                                                src={item.productId.images[0]}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                                <span className="text-gray-600 text-xs">No image</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{item.productName}</p>
                                        <p className="text-sm text-gray-600">
                                            Giá: {item.price.toLocaleString("vi-VN")}₫ / Số lượng: {item.quantity}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 mt-2">
                                            Thành tiền: {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Địa chỉ giao hàng</h2>
                            <div className="space-y-2 text-gray-700">
                                <p><span className="font-semibold">Tên:</span> {order.shippingAddress.fullName}</p>
                                <p><span className="font-semibold">Điện thoại:</span> {order.shippingAddress.phoneNumber}</p>
                                <p><span className="font-semibold">Địa chỉ:</span> {order.shippingAddress.address}</p>
                                <p><span className="font-semibold">Địa điểm:</span> {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}</p>
                            </div>
                        </div>

                        {/* Notes */}
                        {order.notes && (
                            <div className="bg-white rounded-lg shadow p-6 mt-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-2">Ghi chú</h2>
                                <p className="text-gray-700">{order.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Order Summary - Right Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

                            {/* Status Badge */}
                            <div className="mb-6 pb-6 border-b">
                                <p className="text-sm text-gray-600 mb-2">Trạng thái</p>
                                <div className="inline-block">
                                    {(() => {
                                        const statusColors = {
                                            'NEW': 'bg-yellow-100 text-yellow-800',
                                            'CONFIRMED': 'bg-blue-100 text-blue-800',
                                            'PREPARING': 'bg-purple-100 text-purple-800',
                                            'DELIVERING': 'bg-cyan-100 text-cyan-800',
                                            'DELIVERED': 'bg-green-100 text-green-800',
                                            'CANCELLED': 'bg-red-100 text-red-800',
                                            'CANCEL_REQUESTED': 'bg-orange-100 text-orange-800'
                                        };
                                        const statusLabels = {
                                            'NEW': 'Đơn hàng mới',
                                            'CONFIRMED': 'Đã xác nhận',
                                            'PREPARING': 'Chuẩn bị hàng',
                                            'DELIVERING': 'Đang giao hàng',
                                            'DELIVERED': 'Đã giao thành công',
                                            'CANCELLED': 'Hủy đơn hàng',
                                            'CANCEL_REQUESTED': 'Yêu cầu hủy'
                                        };
                                        return (
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[order.status] || statusColors['NEW']}`}>
                                                {statusLabels[order.status] || order.status}
                                            </span>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 pb-6 border-b">
                                <div className="flex justify-between text-gray-700">
                                    <span>Tạm tính:</span>
                                    <span>{order.total.toLocaleString("vi-VN")}₫</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Phí vận chuyển:</span>
                                    <span className="text-green-600">Miễn phí</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Thuế:</span>
                                    <span>0₫</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="mb-6 pb-6 border-b">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Tổng cộng:</span>
                                    <span className="text-2xl font-bold text-green-600">
                                        {order.total.toLocaleString("vi-VN")}₫
                                    </span>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Phương thức thanh toán</p>
                                <p className="font-semibold text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                            </div>

                            {/* Back Button */}
                            <button
                                onClick={() => navigate("/order/history")}
                                className="w-full mt-6 bg-gray-200 text-gray-900 py-3 rounded-lg hover:bg-gray-300 font-semibold transition"
                            >
                                ← Quay lại lịch sử
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;

