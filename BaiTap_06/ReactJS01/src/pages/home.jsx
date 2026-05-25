import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { getProductsApi, getTopSellingProductsApi, getTopViewedProductsApi } from '../util/api';
import TopProductsCarousel from '../components/product/TopProductsCarousel';

const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

const CATEGORY_LOOKUP = {
    gaming: 'Chơi game',
    wireless: 'Không dây',
    office: 'Văn phòng',
    custom: 'Tùy chỉnh'
};

const SERVICE_HIGHLIGHTS = [
    { title: 'Giao nhanh 2H', description: 'Nội thành nhận hàng trong 2 giờ với đơn phù hợp.', icon: '🚚' },
    { title: 'Đổi trả 7 ngày', description: 'Lỗi kỹ thuật đổi mới trong 7 ngày đầu.', icon: '🔁' },
    { title: 'Bảo hành chính hãng', description: 'Cam kết bảo hành theo đúng chính sách nhà sản xuất.', icon: '🛡️' },
    { title: 'Hỗ trợ build custom', description: 'Tư vấn switch, keycap và layout theo nhu cầu.', icon: '🧩' }
];

const ProductGrid = ({ title, subtitle, products }) => (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Bộ sưu tập</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">{title}</h2>
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Xem tất cả</Link>
        </div>

        {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
                Hiện chưa có dữ liệu sản phẩm cho mục này.
            </div>
        ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((product) => {
                    const image = product?.images?.[0] || 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80';
                    return (
                        <article key={product._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md">
                            <img src={image} alt={product?.name} className="h-48 w-full object-cover" />
                            <div className="space-y-2 p-4">
                                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{product?.category}</span>
                                <h3 className="line-clamp-2 text-base font-semibold text-slate-900">{product?.name}</h3>
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-lg font-bold text-blue-600">{currencyFormatter.format(product?.price || 0)}</p>
                                    <p className="text-xs text-slate-500">Đã bán: {product?.sold || 0}</p>
                                </div>
                                <Link
                                    to={`/product/${product._id}`}
                                    className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Xem chi tiết
                                </Link>
                            </div>
                        </article>
                    );
                })}
            </div>
        )}
    </section>
);

/**
 * HomePage Component
 * Main homepage with featured products, categories, and top products
 * Implements best practices:
 * - Composition: Uses ProductGrid and TopProductsCarousel components
 * - Separation of concerns: Each component has single responsibility
 */
const HomePage = () => {
    const { auth } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const [topViewedProducts, setTopViewedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [topProductsLoading, setTopProductsLoading] = useState(true);

    // Fetch all products for homepage sections
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const res = await getProductsApi({ sort: 'newest', limit: 100 });
            if (!res?.message && Array.isArray(res.data)) {
                setProducts(res.data);
            } else {
                setProducts([]);
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);

    // Fetch top selling and top viewed products
    useEffect(() => {
        const fetchTopProducts = async () => {
            setTopProductsLoading(true);
            try {
                const [sellingRes, viewedRes] = await Promise.all([
                    getTopSellingProductsApi(10),
                    getTopViewedProductsApi(10)
                ]);

                if (!sellingRes?.message && Array.isArray(sellingRes)) {
                    setTopSellingProducts(sellingRes);
                }
                if (!viewedRes?.message && Array.isArray(viewedRes)) {
                    setTopViewedProducts(viewedRes);
                }
            } catch (error) {
                console.error('Error fetching top products:', error);
            } finally {
                setTopProductsLoading(false);
            }
        };

        fetchTopProducts();
    }, []);

    const promotionProducts = useMemo(
        () => products.filter((product) => product.isPromotion).slice(0, 4),
        [products]
    );
    const newestProducts = useMemo(() => products.slice(0, 4), [products]);
    const categoryStats = useMemo(() => {
        const counts = products.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts)
            .map(([value, total]) => ({ value, total, label: CATEGORY_LOOKUP[value] || value }))
            .sort((a, b) => b.total - a.total);
    }, [products]);

    const heroDealProducts = useMemo(() => {
        const source = promotionProducts.length > 0 ? promotionProducts : newestProducts;
        return source.slice(0, 3);
    }, [promotionProducts, newestProducts]);

    return (
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 lg:px-8">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-white">
                <div className="grid gap-8 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-14">
                    <div className="space-y-5 text-left">
                        <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                            Website bán bàn phím cơ
                        </span>
                        <h1 className="text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
                            Mua bàn phím cơ chính hãng với ưu đãi thành viên mỗi ngày.
                        </h1>
                        <p className="max-w-2xl text-base leading-7 text-slate-600">
                            Cập nhật liên tục các dòng bàn phím cơ mới nhất, khuyến mãi theo tuần và sản phẩm bán chạy cho game thủ, dân văn phòng và người dùng đam mê custom.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link to="/shop" className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                                Mua sắm ngay
                            </Link>
                            {!auth?.isAuthenticated ? (
                                <Link to="/login" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                                    Đăng nhập thành viên
                                </Link>
                            ) : (
                                <Link to="/tai-khoan" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                                    Xem thông tin tài khoản
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-blue-700">Ưu đãi dành riêng hôm nay</p>
                        <h2 className="mt-2 text-2xl font-bold text-slate-900">Giảm đến 35% dòng bàn phím hot-swap</h2>
                        <p className="mt-2 text-sm text-slate-600">Miễn phí ship toàn quốc cho đơn từ 1.000.000đ.</p>
                        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                            <div className="rounded-2xl bg-blue-50 p-3">
                                <p className="text-xl font-bold text-blue-700">{products.length}</p>
                                <p className="text-xs text-slate-600">Sản phẩm</p>
                            </div>
                            <div className="rounded-2xl bg-indigo-50 p-3">
                                <p className="text-xl font-bold text-indigo-700">{promotionProducts.length}</p>
                                <p className="text-xs text-slate-600">Khuyến mãi</p>
                            </div>
                            <div className="rounded-2xl bg-emerald-50 p-3">
                                <p className="text-xl font-bold text-emerald-700">{products.filter((item) => item.stock > 0).length}</p>
                                <p className="text-xs text-slate-600">Còn hàng</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Danh mục nhanh</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">Chọn đúng nhu cầu sử dụng</h2>
                    <p className="mt-1 text-sm text-slate-500">Lọc nhanh theo mục đích để tìm đúng mẫu bàn phím bạn cần.</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {categoryStats.map((category) => (
                            <Link
                                key={category.value}
                                to={`/shop?category=${category.value}`}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                            >
                                <p className="text-sm font-semibold text-slate-900">{category.label}</p>
                                <p className="mt-1 text-xs text-slate-600">{category.total} sản phẩm</p>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Deal nổi bật</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">Giá tốt trong tuần</h2>
                    <div className="mt-5 space-y-3">
                        {heroDealProducts.map((item) => (
                            <Link
                                key={item._id}
                                to={`/product/${item._id}`}
                                className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 transition hover:border-blue-300 hover:bg-blue-50"
                            >
                                <img
                                    src={item?.images?.[0] || 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80'}
                                    alt={item.name}
                                    className="h-16 w-16 rounded-xl object-cover"
                                />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                                    <p className="text-sm font-bold text-blue-600">{currencyFormatter.format(item.price || 0)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Lợi ích mua sắm</p>
                        <h2 className="mt-2 text-2xl font-bold text-slate-900">Vì sao chọn KeyViet Store?</h2>
                    </div>
                    <Link to="/shop" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Bắt đầu mua hàng</Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {SERVICE_HIGHLIGHTS.map((item) => (
                        <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                            <h3 className="mt-3 text-base font-semibold text-slate-900">{item.title}</h3>
                            <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* New: Top Products Carousels */}
            {loading ? (
                <div className="rounded-3xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-600 shadow-sm">
                    Đang tải dữ liệu sản phẩm...
                </div>
            ) : (
                <>
                    <TopProductsCarousel
                        title="Top 10 Bán Chạy Nhất"
                        subtitle="Các sản phẩm được khách hàng yêu thích và mua nhiều nhất"
                        products={topSellingProducts}
                        variant="selling"
                        loading={topProductsLoading}
                    />
                    <TopProductsCarousel
                        title="Top 10 Xem Nhiều Nhất"
                        subtitle="Các sản phẩm được nhiều khách hàng tìm kiếm và xem"
                        products={topViewedProducts}
                        variant="viewed"
                        loading={topProductsLoading}
                    />
                    <ProductGrid
                        title="Khuyến mãi nổi bật"
                        subtitle="Các mẫu bàn phím cơ đang có ưu đãi hấp dẫn"
                        products={promotionProducts}
                    />
                    <ProductGrid
                        title="Sản phẩm mới nhất"
                        subtitle="Các mẫu vừa được cập nhật trong cửa hàng"
                        products={newestProducts}
                    />
                </>
            )}
        </div>
    )
}
export default HomePage;