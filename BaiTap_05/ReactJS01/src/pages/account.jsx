import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';

const AccountPage = () => {
    const { auth } = useContext(AuthContext);

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 lg:px-8">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white sm:px-10">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-100">Trang thông tin</p>
                    <h1 className="mt-2 text-3xl font-bold">Tài khoản của bạn</h1>
                    <p className="mt-2 text-sm text-blue-100">Quản lý thông tin thành viên và theo dõi trạng thái đăng nhập.</p>
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-10">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Họ và tên</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{auth?.user?.name || 'Chưa cập nhật'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{auth?.user?.email || 'Chưa cập nhật'}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 border-t border-slate-200 p-6 sm:p-10">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Về trang chủ
                    </Link>
                    <Link
                        to="/shop"
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Xem sản phẩm
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Thành viên</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">Hạng Bạc</h3>
                    <p className="mt-2 text-sm text-slate-600">Tích điểm mỗi đơn hàng và nhận mã giảm giá định kỳ.</p>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Ưu đãi cá nhân</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">Giảm 10% đơn đầu</h3>
                    <p className="mt-2 text-sm text-slate-600">Dùng ngay mã <span className="font-semibold text-slate-900">WELCOME10</span> khi thanh toán.</p>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Hỗ trợ</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">Tư vấn 1-1</h3>
                    <p className="mt-2 text-sm text-slate-600">Liên hệ đội ngũ để chọn switch, layout và keycap phù hợp.</p>
                </article>
            </div>
        </div>
    );
};

export default AccountPage;

