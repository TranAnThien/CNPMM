import { useContext, useState } from 'react';
import { loginApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { useToast } from '../components/common/ToastContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [notice, setNotice] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const { showToast } = useToast();

    const onSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setNotice(null);

        try {
            const { email, password } = formData;
            const res = await loginApi(email, password);

            if (res && res.EC === 0) {
                localStorage.setItem("access_token", res.access_token);
                setAuth({
                    isAuthenticated: true,
                    user: {
                        email: res?.user?.email ?? "",
                        name: res?.user?.name ?? ""
                    }
                });
                showToast('Đăng nhập thành công. Chào mừng bạn quay lại!', { type: 'success' });
                // wait briefly then redirect
                setTimeout(() => navigate('/'), 1200);
            } else {
                setNotice({ type: 'error', message: res?.EM ?? 'Email hoặc mật khẩu không hợp lệ.' });
            }
        } catch (error) {
            setNotice({ type: 'error', message: 'Không thể đăng nhập lúc này. Vui lòng thử lại.' });
        }

        setSubmitting(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
            <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
                <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-10 text-white lg:flex">
                    <div>
                        <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">
                            Thành viên
                        </span>
                        <h2 className="mt-6 text-4xl font-black leading-tight">
                            Đăng nhập để nhận ưu đãi và quản lý tài khoản mua sắm.
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-6 text-white/85">
                            Theo dõi lịch sử mua hàng, thông tin tài khoản và ưu đãi độc quyền dành cho thành viên tại KeyViet Store.
                        </p>
                    </div>
                    <div className="rounded-[1.75rem] bg-white/10 p-6 backdrop-blur">
                        <p className="text-sm font-medium text-white/80">Đăng nhập nhanh</p>
                        <p className="mt-2 text-2xl font-black">An toàn và tiện lợi</p>
                    </div>
                </div>

                <div className="p-6 sm:p-8 lg:p-10">
                    <div className="mb-8 text-left">
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">Đăng nhập</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-900">Chào mừng bạn quay lại</h1>
                        <p className="mt-2 text-sm text-slate-500">Đăng nhập để mua hàng nhanh hơn và theo dõi tài khoản cá nhân.</p>
                    </div>

                    {notice && (
                        <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-medium ${notice.type === 'success'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-rose-200 bg-rose-50 text-rose-700'
                            }`}>
                            {notice.message}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={onSubmit}>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Mật khẩu</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>

                    <div className="mt-6 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                        <Link to="/" className="font-medium text-slate-700 transition hover:text-slate-900">
                            ← Quay lại trang chủ
                        </Link>
                        <Link to="/forgot-password" className="font-medium text-blue-600 transition hover:text-blue-700">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-700">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="font-semibold text-blue-600 transition hover:text-blue-700">
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LoginPage;