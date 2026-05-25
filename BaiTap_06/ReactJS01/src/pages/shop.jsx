import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryProductList from '../components/product/CategoryProductList';

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

/**
 * ShopPage Component
 * Main shopping page with filtering and infinite scroll product listing
 * Implements SOLID principles:
 * - Single Responsibility: Handles filters and delegates rendering to CategoryProductList
 * - Dependency Inversion: Uses component abstraction for product list
 */
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

    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setFilters((prev) => {
                if (prev.category === categoryFromUrl) {
                    return prev;
                }
                return { ...prev, category: categoryFromUrl };
            });
        }
    }, [searchParams]);

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleReset = () => {
        setFilters({
            keyword: '',
            category: 'all',
            sort: 'newest',
            minPrice: '',
            maxPrice: '',
            isPromotion: '',
            stockStatus: ''
        });
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
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-200/70 to-indigo-100/70 blur-3xl" />
                        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-slate-900">Ưu đãi nổi bật</p>
                            </div>
                            <div className="mt-4 rounded-[1.5rem] bg-[url('https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center p-6 min-h-[20rem] flex items-end">
                                <div className="w-full rounded-[1.5rem] border border-slate-200 bg-white/95 p-4">
                                    <p className="text-xs uppercase tracking-[0.3em] text-blue-700">Ưu đãi có hạn</p>
                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">Giảm sâu cho các mẫu hot</h2>
                                    <p className="mt-2 text-sm text-slate-600">Khám phá các mẫu bàn phím cơ bán chạy dành cho gaming, văn phòng và custom.</p>
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
                    </div>

                    {/* Use CategoryProductList with infinite scroll */}
                    <CategoryProductList filters={filters} initialLimit={12} />
                </main>
            </section>
        </div>
    );
};

export default ShopPage;


