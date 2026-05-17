import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProductsApi } from '../util/api';

const CATEGORY_OPTIONS = [
    { label: 'Tất cả danh mục', value: 'all' },
    { label: 'Chơi game', value: 'gaming' },
    { label: 'Không dây', value: 'wireless' },
    { label: 'Văn phòng', value: 'office' },
    { label: 'Tùy chỉnh', value: 'custom' },
];

const SORT_OPTIONS = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Bán chạy nhất', value: 'bestseller' },
];

const PROMOTION_OPTIONS = [
    { label: 'Tất cả', value: '' },
    { label: 'Đang khuyến mãi', value: 'true' },
    { label: 'Không khuyến mãi', value: 'false' },
];

const STOCK_OPTIONS = [
    { label: 'Tất cả', value: '' },
    { label: 'Còn hàng', value: 'in-stock' },
    { label: 'Hết hàng', value: 'out-of-stock' },
];

const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

const ShopPage = () => {
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        keyword: '',
        category: 'all',
        sort: 'newest',
        minPrice: '',
        maxPrice: '',
        isPromotion: '',
        stockStatus: ''
    });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (!categoryFromUrl) {
            return;
        }

        setFilters((prev) => {
            if (prev.category === categoryFromUrl) {
                return prev;
            }

            return { ...prev, category: categoryFromUrl };
        });
    }, [searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');

            try {
                const res = await getProductsApi(filters);
                if (res?.message) {
                    setError(res.message);
                    setProducts([]);
                } else {
                    setProducts(Array.isArray(res) ? res : []);
                }
            } catch (error) {
                setError('Không thể tải danh sách sản phẩm.');
                setProducts([]);
            }

            setLoading(false);
        };

        fetchProducts();
    }, [filters]);

    const stats = useMemo(() => {
        const total = products.length;
        const bestsellers = products.reduce((count, product) => count + (product.sold > 0 ? 1 : 0), 0);
        const inStock = products.reduce((count, product) => count + (product.stock > 0 ? 1 : 0), 0);
        return { total, bestsellers, inStock };
    }, [products]);

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleReset = () => {
        setFilters({ keyword: '', category: 'all', sort: 'newest', minPrice: '', maxPrice: '', isPromotion: '', stockStatus: '' });
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-white p-6 shadow-sm lg:p-10">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                    <div className="text-left">
                        <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
                            Siêu sale bàn phím cơ
                        </span>
                        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 lg:text-6xl">
                            Danh mục sản phẩm nổi bật tại KeyViet Store
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 lg:text-lg">
                            Tìm nhanh sản phẩm theo nhiều điều kiện lọc: từ khóa, danh mục, khuyến mãi, tồn kho và khoảng giá.
                        </p>
                        <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-xl">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">Sản phẩm</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                                <p className="text-2xl font-bold text-slate-900">{stats.inStock}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">Còn hàng</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                                <p className="text-2xl font-bold text-slate-900">{stats.bestsellers}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">Bán chạy</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-200/70 to-indigo-100/70 blur-3xl" />
                        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-slate-900">Banner siêu sale</p>
                                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">Khuyến mãi sốc</span>
                            </div>
                            <div className="mt-4 rounded-[1.5rem] bg-[url('https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center p-6 min-h-[20rem] flex items-end">
                                <div className="w-full rounded-[1.5rem] border border-slate-200 bg-white/95 p-4">
                                    <p className="text-xs uppercase tracking-[0.3em] text-blue-700">Ưu đãi có hạn</p>
                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">Giảm đến 35% cho bàn phím cơ cao cấp</h2>
                                    <p className="mt-2 text-sm text-slate-600">Đủ mẫu hot-swap, keycap nghệ thuật và switch gõ mượt cho cả game lẫn văn phòng.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="products" className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
                <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-left">
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">Bộ lọc</p>
                        <h3 className="mt-2 text-2xl font-bold text-slate-900">Tìm kiếm sản phẩm</h3>
                    </div>

                    <div className="mt-6 space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Từ khóa</label>
                            <input
                                type="text"
                                value={filters.keyword}
                                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Tên bàn phím, switch..."
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Danh mục</label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            >
                                {CATEGORY_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Sắp xếp</label>
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Giá từ</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Đến</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    placeholder="5000000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Khuyến mãi</label>
                            <select
                                value={filters.isPromotion}
                                onChange={(e) => handleFilterChange('isPromotion', e.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            >
                                {PROMOTION_OPTIONS.map((option) => (
                                    <option key={option.value || 'all'} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Tồn kho</label>
                            <select
                                value={filters.stockStatus}
                                onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            >
                                {STOCK_OPTIONS.map((option) => (
                                    <option key={option.value || 'all'} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            Đặt lại bộ lọc
                        </button>
                    </div>
                </aside>

                <main className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-3 text-left sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">Danh sách sản phẩm</p>
                            <h2 className="mt-2 text-3xl font-bold text-slate-900">Bàn phím cơ nổi bật</h2>
                        </div>
                        <p className="text-sm text-slate-500">{loading ? 'Đang tải dữ liệu...' : `${products.length} sản phẩm phù hợp`}</p>
                    </div>

                    {error && (
                        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                            {error}
                        </div>
                    )}

                    <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="animate-pulse overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-4">
                                    <div className="h-56 rounded-[1.25rem] bg-slate-200" />
                                    <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
                                    <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
                                    <div className="mt-6 h-10 rounded-2xl bg-slate-200" />
                                </div>
                            ))
                        ) : products.length > 0 ? (
                            products.map((product) => {
                                const image = product?.images?.[0] || 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80';
                                const price = currencyFormatter.format(product?.price || 0);
                                const stockLabel = product?.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng';

                                return (
                                    <article key={product._id} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-md">
                                        <div className="relative overflow-hidden rounded-[1.25rem]">
                                            <img src={image} alt={product?.name} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
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
                                        </div>
                                    </article>
                                );
                            })
                        ) : (
                            <div className="col-span-full rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
                                Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
                            </div>
                        )}
                    </div>
                </main>
            </section>
        </div>
    );
};

export default ShopPage;


