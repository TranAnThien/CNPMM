import { useState } from 'react';
import { createUserApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [notice, setNotice] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setNotice(null);

        try {
            const { name, email, password } = formData;
            const res = await createUserApi(name, email, password);

            if (res) {
                setNotice({ type: 'success', message: 'Tạo tài khoản thành công. Bạn có thể đăng nhập ngay bây giờ.' });
                navigate("/login");
            } else {
                setNotice({ type: 'error', message: 'Không thể tạo tài khoản. Vui lòng thử lại.' });
            }
        } catch (error) {
            setNotice({ type: 'error', message: 'Không thể tạo tài khoản lúc này. Vui lòng thử lại.' });
        }

        setSubmitting(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
            <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
                <div className="order-2 p-6 sm:p-8 lg:order-1 lg:p-10">
                    <div className="mb-8 text-left">
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">Đăng ký</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-900">Tạo tài khoản mới</h1>
                        <p className="mt-2 text-sm text-slate-500">Đăng ký thành viên để nhận ưu đãi và theo dõi thông tin mua sắm.</p>
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
                            <label className="mb-2 block text-sm font-medium text-slate-700">Họ và tên</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="Nguyễn Văn A"
                            />
                        </div>

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
                            {submitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                        </button>
                    </form>

                    <div className="mt-6 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                        <Link to="/" className="font-medium text-slate-700 transition hover:text-slate-900">
                            ← Quay lại trang chủ
                        </Link>
                        <Link to="/login" className="font-medium text-blue-600 transition hover:text-blue-700">
                            Đã có tài khoản? Đăng nhập
                        </Link>
                    </div>
                </div>

                <div className="order-1 hidden flex-col justify-between bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-10 text-white lg:flex">
                    <div>
                        <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">
                            Thành viên mới
                        </span>
                        <h2 className="mt-6 text-4xl font-black leading-tight">
                            Mua sắm tiện lợi với tài khoản thành viên.
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-6 text-white/85">
                            Lưu phiên đăng nhập, quản lý thông tin cá nhân và nhận thông báo ưu đãi nhanh chóng.
                        </p>
                    </div>
                    <div className="rounded-[1.75rem] bg-white/10 p-6 backdrop-blur">
                        <p className="text-sm font-medium text-white/80">Bảo mật đăng nhập</p>
                        <p className="mt-2 text-2xl font-black">Bảo vệ tài khoản 24/7</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RegisterPage;