import { useEffect, useState, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProductsApi } from '../../util/api';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
// AddToCartButton intentionally not used here; using ProductCardFooter for compact layout
import { CartContext } from '../context/cart.context';
import { AuthContext } from '../context/auth.context';
import { useToast } from '../common/ToastContext';

// Compact footer used in product cards: quantity selector + compact outlined add button
function ProductCardFooter({ product, disabled }) {
    const { addToCart } = useContext(CartContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(false);

    const max = product?.stock || 0;

    const increase = () => setQty((q) => Math.min(max || 9999, q + 1));
    const decrease = () => setQty((q) => Math.max(1, q - 1));

    const handleAdd = async () => {
        if (disabled) return;
        if (!auth?.isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            setLoading(true);
            const res = await addToCart(product._id, qty);
            if (res?.success) {
                showToast('Đã thêm vào giỏ hàng', { type: 'success' });
                setQty(1);
            } else {
                showToast(res?.message || 'Không thể thêm vào giỏ', { type: 'error' });
            }
        } catch (err) {
            showToast('Lỗi khi thêm vào giỏ', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-3 w-full">
                <div className="flex items-center gap-3">
                <div className="flex items-center h-9 rounded-lg border border-gray-300 overflow-hidden">
                    <button
                        onClick={decrease}
                        disabled={loading || qty <= 1}
                        className="h-9 px-2 text-lg text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
                    >
                        −
                    </button>
                    <input
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 h-9 text-center text-sm focus:outline-none"
                        min="1"
                    />
                    <button
                        onClick={increase}
                        disabled={loading || qty >= max}
                        className="h-9 px-2 text-lg text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
                    >
                        +
                    </button>
                </div>

                <button
                    onClick={handleAdd}
                    disabled={loading || disabled}
                    className="flex-1 h-9 flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                >
                    <span className="text-lg">🛒</span>
                    <span className="font-bold">+</span>
                </button>
            </div>
        </div>
    );
}

const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

/**
 * CategoryProductList Component
 * Displays category products with infinite scroll/lazy loading capability
 * Implements SOLID principles:
 * - Single Responsibility: Manages only the category product list display
 * - Dependency Inversion: Uses API abstraction layer
 * - Open/Closed: Easy to extend with sorting, filtering
 *
 * @param {Object} props
 * @param {Object} props.filters - Filter parameters (category, keyword, sort, etc.)
 * @param {number} props.initialLimit - Items per page (default: 12)
 */
const CategoryProductList = ({ filters = {}, initialLimit = 12 }) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');
    const [totalProducts, setTotalProducts] = useState(0);

    // Fetch products with pagination
    const fetchProducts = useCallback(async (pageNum, isInitial = false) => {
        setLoading(true);
        setError('');

        try {
            const response = await getProductsApi({
                ...filters,
                page: pageNum,
                limit: initialLimit
            });

            if (response?.message) {
                setError(response.message);
                setProducts(isInitial ? [] : products);
                setHasMore(false);
            } else if (response?.data && Array.isArray(response.data)) {
                const newProducts = response.data;
                setProducts(isInitial ? newProducts : [...products, ...newProducts]);
                setTotalProducts(response.pagination?.total || 0);

                // Check if there are more pages to load
                const hasMorePages = response.pagination?.page < response.pagination?.pages;
                setHasMore(hasMorePages);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Không thể tải danh sách sản phẩm.';
            setError(errorMessage);
            setProducts(isInitial ? [] : products);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [filters, initialLimit, products]);

    // Reset products when filters change
    useEffect(() => {
        setPage(1);
        setProducts([]);
        setHasMore(true);
        fetchProducts(1, true);
    }, [
        filters.keyword,
        filters.category,
        filters.sort,
        filters.minPrice,
        filters.maxPrice,
        filters.isPromotion,
        filters.stockStatus
    ]);

    // Load more products (called by infinite scroll hook)
    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage);
    };

    // Use infinite scroll hook
    const { triggerRef } = useInfiniteScroll(
        loadMore,
        loading,
        hasMore,
        { threshold: 0.1, rootMargin: '200px' }
    );

    return (
        <div className="space-y-6">
            {/* Products Grid */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.length > 0 ? (
                    products.map((product) => {
                        const image = product?.images?.[0] || 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80';
                        const price = currencyFormatter.format(product?.price || 0);
                        const stockLabel = product?.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng';

                        return (
                            <article
                                key={product._id}
                                className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="relative overflow-hidden rounded-[1.25rem]">
                                    <img
                                        src={image}
                                        alt={product?.name}
                                        className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">
                                        {product?.category}
                                    </div>
                                </div>

                                <div className="mt-4 space-y-3 text-left">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{product?.name}</h3>
                                        <p className="mt-1 text-sm text-slate-600">{stockLabel}</p>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-xl font-bold text-blue-600">{price}</p>
                                        <p className="text-sm text-slate-600">Đã bán: {product?.sold || 0}</p>
                                    </div>

                                    <Link
                                        to={`/product/${product._id}`}
                                        className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        Xem chi tiết
                                    </Link>

                                    <ProductCardFooter
                                        product={product}
                                        disabled={product?.stock <= 0}
                                    />
                                </div>
                            </article>
                        );
                    })
                ) : !error ? null : null}
            </div>

            {/* Error Message */}
            {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {error}
                </div>
            )}

            {/* Loading Skeletons */}
            {loading && products.length === 0 && (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="animate-pulse overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-4">
                            <div className="h-56 rounded-[1.25rem] bg-slate-200" />
                            <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
                            <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
                            <div className="mt-6 h-10 rounded-2xl bg-slate-200" />
                        </div>
                    ))}
                </div>
            )}

            {/* No Results */}
            {products.length === 0 && !loading && !error && (
                <div className="col-span-full rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
                    Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
                </div>
            )}

            {/* Infinite Scroll Trigger */}
            {hasMore && products.length > 0 && (
                <div
                    ref={triggerRef}
                    className="flex justify-center py-8"
                >
                    {loading && (
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                            <span className="text-sm font-medium text-slate-700">Đang tải thêm sản phẩm...</span>
                        </div>
                    )}
                </div>
            )}

            {/* End of Results */}
            {!hasMore && products.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-center text-sm text-slate-600">
                    Đã hiển thị tất cả {totalProducts} sản phẩm
                </div>
            )}
        </div>
    );
};

export default CategoryProductList;

