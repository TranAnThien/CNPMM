import { useRef } from 'react';
import { Link } from 'react-router-dom';

const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

/**
 * TopProductsCarousel Component
 * Displays products in a horizontal scrollable carousel using Tailwind CSS
 * Implementing SOLID principles:
 * - Single Responsibility: Only handles rendering products in carousel format
 * - Open/Closed: Easy to extend with new features without modifying
 *
 * @param {Object} props
 * @param {string} props.title - Carousel title
 * @param {string} props.subtitle - Carousel subtitle/description
 * @param {Array} props.products - Array of products to display
 * @param {string} props.variant - 'selling' or 'viewed' to determine badge color and text
 * @param {boolean} props.loading - Loading state indicator
 */
const TopProductsCarousel = ({
    title,
    subtitle,
    products = [],
    variant = 'selling',
    loading = false
}) => {
    const scrollerRef = useRef(null);

    const badgeConfig = {
        selling: {
            label: '🔥 Bán chạy',
            bgColor: 'bg-rose-100',
            textColor: 'text-rose-700',
            badgeBgColor: 'bg-rose-600'
        },
        viewed: {
            label: '👀 Xem nhiều',
            bgColor: 'bg-amber-100',
            textColor: 'text-amber-700',
            badgeBgColor: 'bg-amber-600'
        }
    };

    const config = badgeConfig[variant] || badgeConfig.selling;

    const handleScroll = (direction) => {
        if (!scrollerRef.current) {
            return;
        }

        const cardWidth = 240;
        scrollerRef.current.scrollBy({
            left: direction === 'left' ? -cardWidth : cardWidth,
            behavior: 'smooth'
        });
    };

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${config.textColor}`}>
                        {variant === 'selling' ? 'Bán chạy nhất' : 'Xem nhiều nhất'}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">{title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleScroll('left')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
                        aria-label="Cuon trai"
                    >
                        <span aria-hidden="true">&larr;</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleScroll('right')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
                        aria-label="Cuon phai"
                    >
                        <span aria-hidden="true">&rarr;</span>
                    </button>
                    <Link to="/shop" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                        Xem tat ca
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse flex-shrink-0 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 h-80"
                        />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
                    Hiện chưa có sản phẩm cho mục này.
                </div>
            ) : (
                <div ref={scrollerRef} className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-4 pb-2">
                        {products.map((product, index) => {
                            const image = product?.images?.[0] || 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80';
                            const price = currencyFormatter.format(product?.price || 0);
                            const statValue = variant === 'selling' ? product?.sold || 0 : product?.views || 0;
                            const statLabel = variant === 'selling' ? 'Đã bán' : 'Lượt xem';

                            return (
                                <article
                                    key={product._id}
                                    className="group flex-shrink-0 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-md snap-center"
                                >
                                    <div className="relative overflow-hidden bg-slate-100">
                                        <img
                                            src={image}
                                            alt={product?.name}
                                            className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                        <div className={`absolute left-3 top-3 rounded-full ${config.bgColor} ${config.textColor} px-3 py-1 text-xs font-semibold`}>
                                            {product?.category}
                                        </div>
                                        <div className={`absolute right-3 top-3 rounded-full ${config.badgeBgColor} text-white px-3 py-1 text-xs font-semibold`}>
                                            #{index + 1}
                                        </div>
                                    </div>

                                    <div className="space-y-3 p-4 text-left">
                                        <div>
                                            <h3 className="line-clamp-2 text-sm font-bold text-slate-900">
                                                {product?.name}
                                            </h3>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-lg font-bold text-blue-600">{price}</p>
                                            <p className="text-xs font-semibold text-slate-600">
                                                {statLabel}: <span className={config.textColor}>{statValue.toLocaleString()}</span>
                                            </p>
                                        </div>

                                        <Link
                                            to={`/product/${product._id}`}
                                            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            )}

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default TopProductsCarousel;

