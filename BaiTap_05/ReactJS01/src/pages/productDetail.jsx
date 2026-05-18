import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getProductDetailApi, getProductsApi } from '../util/api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await getProductDetailApi(id);

                if (res?.message) {
                    setError(res.message);
                    setProduct(null);
                } else {
                    setProduct(res);
                }
            } catch (error) {
                setError('Không thể tải chi tiết sản phẩm.');
                setProduct(null);
            }

            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (!product) {
            return;
        }

        setQuantity(product.stock > 0 ? 1 : 0);
    }, [product]);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!product?.category) {
                setRelatedProducts([]);
                return;
            }

            const res = await getProductsApi({ category: product.category, sort: 'bestseller', limit: 12 });
            if (!res?.message && Array.isArray(res?.data)) {
                setRelatedProducts(res.data.filter((item) => item._id !== product._id).slice(0, 4));
            } else {
                setRelatedProducts([]);
            }
        };

        fetchRelatedProducts();
    }, [product]);

    const images = useMemo(() => {
        if (Array.isArray(product?.images) && product.images.length > 0) {
            return product.images;
        }

        return ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80'];
    }, [product]);

    const maxQuantity = product?.stock || 0;
    const canIncrease = quantity < maxQuantity;
    const canDecrease = quantity > 1;

    const increaseQuantity = () => {
        if (canIncrease) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        if (canDecrease) {
            setQuantity((prev) => prev - 1);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-4 py-10 lg:px-8">
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-700 shadow-sm">
                    Đang tải chi tiết sản phẩm...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
                <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-center text-rose-700 shadow-sm">
                    <h1 className="text-2xl font-black">Không thể tải sản phẩm</h1>
                    <p className="mt-2 text-sm text-rose-700/80">{error}</p>
                    <Link to="/" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
                        Quay lại cửa hàng
                    </Link>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const statusText = product.stock > 0 ? 'Còn hàng' : 'Hết hàng';
    const statusClass = product.stock > 0
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-rose-200 bg-rose-50 text-rose-700';

    return (
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 lg:px-8">
            <div className="mb-6 flex items-center justify-between gap-4">
                <Link to="/shop" className="text-sm font-semibold text-blue-600 transition hover:text-blue-700">
                    ← Quay lại cửa hàng
                </Link>
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] ${statusClass}`}>
                    {statusText}
                </span>
            </div>

            <section className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
                <div className="min-w-0">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        spaceBetween={16}
                        className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-3"
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={`${image}-${index}`}>
                                <img
                                    src={image}
                                    alt={`${product.name} ${index + 1}`}
                                    className="h-[28rem] w-full rounded-[1.5rem] object-cover"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="text-left">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {product.category}
                        </span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}>
                            {statusText}
                        </span>
                    </div>

                    <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">{product.name}</h1>
                    <div className="mt-4 flex flex-wrap items-end gap-4">
                        <p className="text-4xl font-black text-blue-600">{currencyFormatter.format(product.price || 0)}</p>
                        <p className="text-sm text-slate-600">Đã bán: <span className="font-semibold text-slate-900">{product.sold || 0}</span></p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Danh mục</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">{product.category}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Tồn kho</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">{product.stock || 0} sản phẩm</p>
                        </div>
                    </div>

                    <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Số lượng mua</p>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={decreaseQuantity}
                                disabled={!canDecrease}
                                className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-xl font-black text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                -
                            </button>
                            <div className="min-w-[6rem] rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-lg font-black text-slate-900">
                                {quantity}
                            </div>
                            <button
                                type="button"
                                onClick={increaseQuantity}
                                disabled={!canIncrease}
                                className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-xl font-black text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                +
                            </button>
                            <p className="text-sm text-slate-600">
                                Tối đa {maxQuantity} sản phẩm trong kho.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            disabled={product.stock <= 0}
                            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                            Mua ngay
                        </button>
                        <button
                            type="button"
                            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                <div className="mb-5 text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Sản phẩm tương tự</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">Cùng danh mục {product.category}</h2>
                </div>

                {relatedProducts.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
                        Chưa có sản phẩm tương tự.
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {relatedProducts.map((item) => {
                            const image = item?.images?.[0] || 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80';
                            return (
                                <article key={item._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md">
                                    <img src={image} alt={item.name} className="h-44 w-full object-cover" />
                                    <div className="space-y-2 p-4">
                                        <h3 className="line-clamp-2 font-semibold text-slate-900">{item.name}</h3>
                                        <p className="text-sm text-slate-600">Đã bán: {item.sold || 0}</p>
                                        <p className="text-lg font-bold text-blue-600">{currencyFormatter.format(item.price || 0)}</p>
                                        <Link to={`/product/${item._id}`} className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProductDetailPage;


