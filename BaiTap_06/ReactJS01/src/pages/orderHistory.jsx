import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../util/axios.customize";
import { useToast } from "../components/common/ToastContext";

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const { showToast } = useToast();

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const fetchOrders = async (page) => {
        try {
            setLoading(true);
            const response = await axios.get(`/v1/api/order/history?page=${page}&limit=10`);
            setOrders(response?.orders || []);
            setPagination(response?.pagination || {});
        } catch (error) {
            console.error("Failed to load orders:", error);
            showToast(error.response?.data?.message || "Tải đơn hàng thất bại", { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeColor = (status) => {
        const colors = {
            'NEW': 'bg-yellow-100 text-yellow-800',
            'CONFIRMED': 'bg-blue-100 text-blue-800',
            'PREPARING': 'bg-purple-100 text-purple-800',
            'DELIVERING': 'bg-cyan-100 text-cyan-800',
            'DELIVERED': 'bg-green-100 text-green-800',
            'CANCELLED': 'bg-red-100 text-red-800',
            'CANCEL_REQUESTED': 'bg-orange-100 text-orange-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'NEW': 'Đơn hàng mới',
            'CONFIRMED': 'Đã xác nhận',
            'PREPARING': 'Chuẩn bị hàng',
            'DELIVERING': 'Đang giao hàng',
            'DELIVERED': 'Đã giao thành công',
            'CANCELLED': 'Hủy đơn hàng',
            'CANCEL_REQUESTED': 'Yêu cầu hủy'
        };
        return labels[status] || status;
    };

    if (loading && orders.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (orders.length === 0 && !loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="mb-4 text-5xl">📦</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chưa có đơn hàng</h2>
                        <p className="text-gray-600 mb-6">Bạn chưa đặt hàng nào trước đây</p>
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
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Lịch sử đơn hàng</h1>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.map(order => (
                        <div
                            key={order._id}
                            onClick={() => navigate(`/order/${order._id}`)}
                            className="bg-white rounded-lg shadow hover:shadow-lg cursor-pointer transition p-6 border border-gray-200"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                {/* Left: Order Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="font-bold text-gray-900">
                                            Đơn hàng #{order._id.slice(-8).toUpperCase()}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        📅 {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        📦 {order.items.length} sản phẩm
                                    </p>
                                </div>

                                {/* Middle: Total */}
                                <div className="text-right md:text-center">
                                    <p className="text-xs text-gray-600 mb-1">Tổng tiền</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {order.total?.toLocaleString("vi-VN")}₫
                                    </p>
                                </div>

                                {/* Right: Status */}
                                <div className="text-right">
                                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>
                            </div>

                            {/* Preview Items */}
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex gap-2 overflow-x-auto">
                                    {order.items.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded overflow-hidden">
                                            {item.productId?.images?.[0] ? (
                                                <img
                                                    src={item.productId.images[0]}
                                                    alt="product"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                                    No img
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded flex items-center justify-center text-xs font-semibold text-gray-700">
                                            +{order.items.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Click to view details hint */}
                            <p className="text-xs text-blue-600 mt-3 flex items-center gap-1">
                                Xem chi tiết →
                            </p>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {pagination.pages && pagination.pages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {/* Previous Button */}
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1 || loading}
                            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            ← Trước
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                disabled={loading}
                                className={`px-4 py-2 rounded transition ${
                                    currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                } disabled:opacity-50`}
                            >
                                {page}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                            disabled={currentPage === pagination.pages || loading}
                            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Sau →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;

