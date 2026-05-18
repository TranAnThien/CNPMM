import { useState } from 'react';
import { forgotPasswordApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', newPassword: '' });
    const [notice, setNotice] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setNotice(null);

        try {
            const res = await forgotPasswordApi(formData.email, formData.newPassword);
            if (res && res.EC === 0) {
                setNotice({ type: 'success', message: res.EM || 'Cập nhật mật khẩu thành công.' });
                navigate("/login");
            } else {
                setNotice({ type: 'error', message: res?.EM ?? 'Không thể cập nhật mật khẩu.' });
            }
        } catch (error) {
            setNotice({ type: 'error', message: 'Không thể cập nhật mật khẩu lúc này. Vui lòng thử lại.' });
        }

        setSubmitting(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
            <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
                <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-10 text-white lg:flex">
                    <div>
                        <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">
                            Hỗ trợ tài khoản
                        </span>
                        <h2 className="mt-6 text-4xl font-black leading-tight">
                            Đổi mật khẩu nhanh, tiếp tục mua sắm liền mạch.
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-6 text-white/85">
                            Chỉ cần email đã đăng ký, bạn có thể cập nhật mật khẩu mới để truy cập lại tài khoản trong vài giây.
                        </p>
                    </div>
                    <div className="rounded-[1.75rem] bg-white/10 p-6 backdrop-blur">
                        <p className="text-sm font-medium text-white/80">Mẹo bảo mật</p>
                        <p className="mt-2 text-2xl font-black">Dùng mật khẩu mạnh và không chia sẻ với người khác</p>
                    </div>
                </div>

                <div className="p-6 sm:p-8 lg:p-10">
                    <div className="mb-8 text-left">
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">Khôi phục mật khẩu</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-900">Đặt lại mật khẩu nhanh chóng</h1>
                        <p className="mt-2 text-sm text-slate-500">Nhập email đã đăng ký và mật khẩu mới để tiếp tục mua sắm.</p>
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
                            <label className="mb-2 block text-sm font-medium text-slate-700">Mật khẩu mới</label>
                            <input
                                type="password"
                                required
                                value={formData.newPassword}
                                onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {submitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        <Link to="/login" className="font-semibold text-blue-600 transition hover:text-blue-700">
                            ← Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ForgotPasswordPage;