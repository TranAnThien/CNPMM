import { useEffect, useState } from "react";
import { getUserApi } from "../util/api";

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await getUserApi();
                if (!res?.message) {
                    setDataSource(res);
                } else {
                    setError(res.message);
                    setDataSource([]);
                }
            } catch (error) {
                setError('Không thể tải danh sách người dùng.');
                setDataSource([]);
            }
            setLoading(false);
        }
        fetchUser();
    }, []);

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl sm:p-8">
                <div className="mb-6 flex flex-col gap-3 text-left sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-300">Users</p>
                        <h1 className="mt-2 text-3xl font-black text-white">Danh sách người dùng</h1>
                    </div>
                    <p className="text-sm text-slate-400">Bảng dữ liệu được render bằng HTML Table + Tailwind CSS.</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200">
                        {error}
                    </div>
                )}

                <div className="overflow-hidden rounded-3xl border border-white/10">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10 text-left">
                            <thead className="bg-slate-950/70">
                                <tr>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Id</th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Email</th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Name</th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10 bg-white/5">
                                {loading ? (
                                    <tr>
                                        <td className="px-5 py-6 text-slate-300" colSpan={4}>
                                            Đang tải danh sách người dùng...
                                        </td>
                                    </tr>
                                ) : dataSource.length > 0 ? (
                                    dataSource.map((user) => (
                                        <tr key={user._id} className="transition hover:bg-white/5">
                                            <td className="px-5 py-4 align-top text-sm text-slate-300">{user._id}</td>
                                            <td className="px-5 py-4 align-top text-sm font-medium text-white">{user.email}</td>
                                            <td className="px-5 py-4 align-top text-sm text-slate-300">{user.name}</td>
                                            <td className="px-5 py-4 align-top">
                                                <span className="inline-flex rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-200">
                                                    {user.role || 'User'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="px-5 py-6 text-slate-300" colSpan={4}>
                                            Không có dữ liệu người dùng.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserPage;