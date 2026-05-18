import { useContext, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    const navigation = useMemo(() => [
        { label: 'Trang chủ', to: '/' },
        { label: 'Sản phẩm', to: '/shop' },
        ...(auth?.isAuthenticated ? [{ label: 'Tài khoản', to: '/tai-khoan' }] : []),
    ], [auth?.isAuthenticated]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setAuth({
            isAuthenticated: false,
            user: { email: '', name: '' }
        });
        setMenuOpen(false);
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
                <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-black text-white shadow-md">
                        K
                    </div>
                    <div className="text-left">
                        <p className="text-xs uppercase tracking-[0.35em] text-blue-600">Bàn phím cơ</p>
                        <h1 className="m-0 text-lg font-bold text-slate-900">KeyViet Store</h1>
                    </div>
                </Link>

                <nav className="hidden items-center gap-2 md:flex">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) => [
                                'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-blue-600 text-white shadow'
                                    : 'text-slate-700 hover:bg-slate-100'
                            ].join(' ')}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {auth?.isAuthenticated ? (
                        <>
                            <div className="hidden text-right md:block">
                                <p className="text-xs text-slate-500">Xin chào</p>
                                <p className="text-sm font-semibold text-slate-900">{auth?.user?.name || auth?.user?.email}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="hidden rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 md:inline-flex"
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <div className="hidden items-center gap-2 md:flex">
                            <Link
                                to="/login"
                                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}

                    <button
                        type="button"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 md:hidden"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                    >
                        <span className="text-xl">☰</span>
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="border-t border-slate-200 bg-white px-4 pb-4 md:hidden">
                    <div className="mx-auto flex max-w-7xl flex-col gap-3 pt-4">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/'}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) => [
                                    'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                ].join(' ')}
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Tài khoản</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">{auth?.isAuthenticated ? (auth?.user?.name || auth?.user?.email) : 'Khách'}</p>
                        </div>

                        {auth?.isAuthenticated ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                            >
                                Đăng xuất
                            </button>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    to="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMenuOpen(false)}
                                    className="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;